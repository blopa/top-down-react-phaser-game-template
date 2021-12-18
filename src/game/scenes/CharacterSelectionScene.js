import { Scene } from 'phaser';
import { v4 as uuid } from 'uuid';

// Constants
import {
    IDLE_FRAME,
    DOWN_DIRECTION,
    HERO_SPRITE_NAME,
    NPC_01_SPRITE_NAME,
    NPC_02_SPRITE_NAME,
    NPC_03_SPRITE_NAME,
    NPC_04_SPRITE_NAME,
    NPC_05_SPRITE_NAME,
} from '../../utils/constants';

// Actions
import setMenuItemsAction from '../../redux/actions/menu/setMenuItemsAction';
import setMenuOnSelectAction from '../../redux/actions/menu/setMenuOnSelectAction';
import setMyPlayerIdAction from '../../redux/actions/players/setMyPlayerIdAction';
import setMyCharacterIdAction from '../../redux/actions/players/setMyCharacterIdAction';

// Utils
import { getDispatch, getSelectorData } from '../../utils/utils';
import {
    handleCreateHeroAnimations,
    applyLocalState,
    purgeLocalState,
    startGameScene,
    changeScene,
} from '../../utils/sceneHelpers';

// Selectors
import { selectGameHeight, selectGameWidth } from '../../redux/selectors/selectGameSettings';
import { selectGameIsOffline } from '../../redux/selectors/selectGameManager';
import setPlayersAction from '../../redux/actions/players/setPlayersAction';

export default class CharacterSelectionScene extends Scene {
    constructor() {
        super('CharacterSelectionScene');
    }

    preload() {
        // Preload assets for the splash and title screens
    }

    create() {
        const dispatch = getDispatch();
        const gameWidth = getSelectorData(selectGameWidth);
        const gameHeight = getSelectorData(selectGameHeight);
        const isGameOffline = getSelectorData(selectGameIsOffline);

        const [
            getSelectedCharacter,
            setSelectedCharacter,
            characterStateId,
        ] = applyLocalState(null);

        dispatch(setMenuOnSelectAction((item) => {
            handleStartGameSelected();
        }));

        this.add.text(
            gameWidth / 2,
            gameHeight * 0.2,
            'Select Your Player',
            {
                fontFamily: '"Press Start 2P"',
                color: '#FFFFFF',
            }
        ).setOrigin(0.5);

        const sprites = this.add.group();

        let initialPosX = 0;
        // Create sprites
        [
            HERO_SPRITE_NAME,
            NPC_01_SPRITE_NAME,
            NPC_02_SPRITE_NAME,
            NPC_03_SPRITE_NAME,
            NPC_04_SPRITE_NAME,
            NPC_05_SPRITE_NAME,
        ].forEach((spriteName, index) => {
            const sprite = this.add.sprite(
                0,
                0,
                spriteName,
                IDLE_FRAME.replace('position', DOWN_DIRECTION)
            ).setName(spriteName);

            sprite.selected = false;
            sprite.setSelected = (selected) => {
                if (selected) {
                    const selectedCharacter = getSelectedCharacter();
                    if (selectedCharacter) {
                        const result = sprites.getChildren().find(
                            (s) => s.name === selectedCharacter
                        );
                        result.setSelected(false);
                    }

                    setSelectedCharacter(spriteName);
                    dispatch(setMenuItemsAction(['go']));
                    sprite.selected = true;
                    sprite.setScale(2);
                } else {
                    setSelectedCharacter(null);
                    dispatch(setMenuItemsAction([]));
                    sprite.selected = false;
                    sprite.setScale(1);
                }
            };

            sprites.add(sprite);
            initialPosX += sprite.width * 2;

            handleCreateHeroAnimations(this, spriteName);
            sprite.anims.play(`${spriteName}_walk_${DOWN_DIRECTION}`);

            sprite.setInteractive();
            sprite.on('pointerup', () => {
                sprite.setSelected(!sprite.selected);
            });
        });

        // set positions
        let nextPosX = (gameWidth - initialPosX) / 2;
        sprites.getChildren().forEach((sprite, index) => {
            sprite.setPosition(
                nextPosX,
                Math.ceil(gameHeight * 0.35)
            );

            nextPosX += sprite.width * 2;
        });

        const myPlayerId = uuid();
        const handleStartGameSelected = () => Promise.all([
            dispatch(setMenuItemsAction([])),
            dispatch(setMenuOnSelectAction(null)),
            dispatch(setMyPlayerIdAction(myPlayerId)),
            dispatch(setMyCharacterIdAction(getSelectedCharacter())),
        ]).then(() => {
            const characterId = getSelectedCharacter();
            purgeLocalState(characterStateId);

            if (isGameOffline) {
                changeScene(this, 'WaitingRoomScene');
            } else {
                // TODO make offline game work
                startGameScene(this, 'main_map', () => {
                    // const players = [{
                    //     playerId: uuid(),
                    //     characterId: 'npc_01',
                    //     position: { x: 19, y: 0 },
                    // }];
                    const positions = [
                        { x: 0, y: 0 },
                        { x: 19, y: 0 },
                        { x: 19, y: 19 },
                        { x: 0, y: 19 },
                    ];

                    const players = [{
                        playerId: myPlayerId,
                        characterId,
                        position: positions[Math.floor(Math.random() * positions.length)],
                    }];

                    return dispatch(setPlayersAction(players));
                });
            }
        });
    }
}
