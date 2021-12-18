import { Scene } from 'phaser';

// Actions
import setMenuItemsAction from '../../redux/actions/menu/setMenuItemsAction';
import setMenuOnSelectAction from '../../redux/actions/menu/setMenuOnSelectAction';
import setCurrentRoomAction from '../../redux/actions/gameManager/setCurrentRoomAction';
import setMyPlayerIdAction from '../../redux/actions/players/setMyPlayerIdAction';
import setGameIsOfflineAction from '../../redux/actions/gameManager/setGameIsOfflineAction';

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

    create() {
        const dispatch = getDispatch();

        const menuItems = [
            'new_game',
            // 'offline_game',
            'exit',
        ];

        const {
            roomId,
            playerId,
            lastTimeConnected,
        } = JSON.parse(
            localStorage.getItem(LAST_TIME_CONNECTED_DATA_KEY) || '{}'
        );

        const canReconnect = roomId
            && playerId
            && lastTimeConnected - Date.now() < CAN_RECONNECT_THRESHOLD;

        if (canReconnect) {
            menuItems.splice(1, 0, 'reconnect');
        }

        dispatch(setMenuItemsAction(menuItems));
        dispatch(setMenuOnSelectAction((item) => {
            dispatch(setMenuItemsAction([]));
            dispatch(setMenuOnSelectAction(null));

            switch (item) {
                case 'new_game': {
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

                    break;
                }

                case 'reconnect': {
                    Promise.all([
                        dispatch(setCurrentRoomAction(roomId)),
                        dispatch(setMyPlayerIdAction(playerId)),
                    ]).then(() => {
                        this.scene.start('LoadAssetsScene', {
                            nextScene: 'ReconnectScene',
                            assets: {},
                        });
                    });

                    break;
                }

                case 'offline_game': {
                    dispatch(setGameIsOfflineAction(true));

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

                    break;
                }

                case 'exit':
                default: {
                    Promise.all([
                        dispatch(setMenuItemsAction([])),
                        dispatch(setMenuOnSelectAction(null)),
                    ]).then(() => {
                        window.location.reload();
                    });

                    break;
                }
            }
        }));
    }
}
