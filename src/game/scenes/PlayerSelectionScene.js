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

// Store
import store from '../../redux/store';

// Utils
import {
    getSelectorData,
    handleCreateHeroAnimations,
    applyLocalState,
    purgeLocalState,
} from '../../utils/sceneHelpers';

// Selectors
import { selectGameHeight, selectGameWidth } from '../../redux/selectors/selectGameSettings';

export default class PlayerSelectionScene extends Scene {
    constructor() {
        super('PlayerSelectionScene');
    }

    preload() {
        // Preload assets for the splash and title screens
    }

    create() {
        const { dispatch } = store;
        const gameWidth = getSelectorData(selectGameWidth);
        const gameHeight = getSelectorData(selectGameHeight);
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
                    dispatch(setMenuItemsAction(['Go']));
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

        initialPosX = (gameWidth - initialPosX) / 2;
        // set positions
        let nextPosX = initialPosX;
        sprites.getChildren().forEach((sprite, index) => {
            sprite.setPosition(
                nextPosX,
                Math.ceil(gameHeight * 0.35)
            );

            nextPosX += sprite.width * 2;
        });

        const handleStartGameSelected = () => Promise.all([
            dispatch(setMenuItemsAction([])),
            dispatch(setMenuOnSelectAction(null)),
            dispatch(setMyPlayerIdAction(uuid())),
            dispatch(setMyCharacterIdAction(getSelectedCharacter())),
        ]).then(() => {
            purgeLocalState(characterStateId);
            this.scene.start('LoadAssetsScene', {
                nextScene: 'WaitingRoomScene',
                assets: {},
            });
        });
    }
}