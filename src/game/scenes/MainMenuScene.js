import { Scene } from 'phaser';

// Actions
import setMenuItemsAction from '../../redux/actions/menu/setMenuItemsAction';
import setMenuOnSelectAction from '../../redux/actions/menu/setMenuOnSelectAction';
import setCurrentRoomAction from '../../redux/actions/gameManager/setCurrentRoomAction';
import setMyPlayerIdAction from '../../redux/actions/players/setMyPlayerIdAction';

// Constants
import {
    HERO_SPRITE_NAME,
    NPC_01_SPRITE_NAME,
    NPC_02_SPRITE_NAME,
    NPC_03_SPRITE_NAME,
    NPC_04_SPRITE_NAME,
    NPC_05_SPRITE_NAME,
    CAN_RECONNECT_THRESHOLD,
    LAST_TIME_CONNECTED_DATA_KEY,
} from '../../utils/constants';

// Utils
import { getDispatch } from '../../utils/utils';

export default class MainMenuScene extends Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() {
        // TODO
    }

    create() {
        const dispatch = getDispatch();

        dispatch(setMenuItemsAction(['Start Game', 'Exit']));
        dispatch(setMenuOnSelectAction((item) => {
            if (item === 'Start Game') {
                dispatch(setMenuItemsAction([]));
                dispatch(setMenuOnSelectAction(null));

                const {
                    roomId,
                    playerId,
                    lastTimeConnected,
                } = JSON.parse(
                    localStorage.getItem(LAST_TIME_CONNECTED_DATA_KEY) || '{}'
                );

                if (
                    roomId
                    && playerId
                    && lastTimeConnected - Date.now() < CAN_RECONNECT_THRESHOLD
                ) {
                    Promise.all([
                        dispatch(setCurrentRoomAction(roomId)),
                        dispatch(setMyPlayerIdAction(playerId)),
                    ]).then(() => {
                        this.scene.start('LoadAssetsScene', {
                            nextScene: 'ReconnectScene',
                            assets: {},
                        });
                    });
                } else {
                    this.scene.start('LoadAssetsScene', {
                        nextScene: 'CharacterSelectionScene',
                        assets: {
                            atlases: [
                                HERO_SPRITE_NAME,
                                NPC_01_SPRITE_NAME,
                                NPC_02_SPRITE_NAME,
                                NPC_03_SPRITE_NAME,
                                NPC_04_SPRITE_NAME,
                                NPC_05_SPRITE_NAME,
                            ],
                        },
                    });
                }
            } else {
                Promise.all([
                    dispatch(setMenuItemsAction([])),
                    dispatch(setMenuOnSelectAction(null)),
                ]).then(() => {
                    window.location.reload();
                });
            }
        }));
    }
}
