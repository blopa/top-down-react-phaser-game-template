import { Scene } from 'phaser';
import io from 'socket.io-client';

// Store
import store from '../../redux/store';

// Constants
import { REQUEST_NEW_GAME } from '../../server/constants';
import { DOWN_DIRECTION, IDLE_FRAME } from '../../utils/constants';

// Actions
import setHeroInitialPositionAction from '../../redux/actions/heroData/setHeroInitialPositionAction';
import setHeroPreviousPositionAction from '../../redux/actions/heroData/setHeroPreviousPositionAction';
import setHeroInitialFrameAction from '../../redux/actions/heroData/setHeroInitialFrameAction';
import setMenuItemsAction from '../../redux/actions/menu/setMenuItemsAction';
import setMenuOnSelectAction from '../../redux/actions/menu/setMenuOnSelectAction';
import setMapKeyAction from '../../redux/actions/mapData/setMapKeyAction';
import setHeroFacingDirectionAction from '../../redux/actions/heroData/setHeroFacingDirectionAction';

// Utils
import { getSelectorData, handleCreateHeroAnimations } from '../../utils/sceneHelpers';

// Selectors
import { selectMyCharacterId, selectMyPlayerId } from '../../redux/selectors/selectPlayers';
import { selectGameHeight, selectGameWidth } from '../../redux/selectors/selectGameSettings';

export default class WaitingRoomScene extends Scene {
    constructor() {
        super('WaitingRoomScene');
    }

    preload() {
        // TODO
    }

    create() {
        const { dispatch } = store;
        const gameWidth = getSelectorData(selectGameWidth);
        const gameHeight = getSelectorData(selectGameHeight);
        const spriteName = getSelectorData(selectMyCharacterId);
        const myPlayerId = getSelectorData(selectMyPlayerId);

        const sprite = this.add.sprite(
            gameWidth / 2,
            gameHeight * 0.35,
            spriteName,
            IDLE_FRAME.replace('position', DOWN_DIRECTION)
        ).setName(spriteName).setScale(2);

        handleCreateHeroAnimations(this, spriteName);
        sprite.anims.play(`${spriteName}_walk_${DOWN_DIRECTION}`);

        this.add.text(
            gameWidth / 2,
            gameHeight * 0.2,
            'Waiting For\nOther Players',
            {
                fontFamily: '"Press Start 2P"',
                color: '#FFFFFF',
            }
        ).setOrigin(0.5);

        const host = process.env.REACT_APP_SERVER_HOST;
        const port = process.env.REACT_APP_SERVER_PORT;
        const socket = io(`${host}:${port}`);
        socket.emit(REQUEST_NEW_GAME, JSON.stringify({
            characterId: spriteName,
            playerId: myPlayerId,
        }));

        const map = 'main_map';
        const handleStartGameSelected = () => Promise.all([
            dispatch(setMenuItemsAction([])),
            dispatch(setMenuOnSelectAction(null)),
            dispatch(setMapKeyAction(map)),
            dispatch(setHeroFacingDirectionAction(DOWN_DIRECTION)),
            dispatch(setHeroInitialPositionAction({ x: 0, y: 0 })),
            dispatch(setHeroPreviousPositionAction({ x: 0, y: 0 })),
            dispatch(setHeroInitialFrameAction(
                IDLE_FRAME.replace('position', DOWN_DIRECTION)
            )),
        ]).then(() => {
            this.scene.start('LoadAssetsScene', {
                nextScene: 'GameScene',
                assets: {
                    mapKey: map,
                },
            });
        });
    }
}
