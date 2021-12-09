import { Scene } from 'phaser';

// Store
import store from '../../redux/store';

// Actions
import setMenuItemsAction from '../../redux/actions/menu/setMenuItemsAction';
import setMenuOnSelectAction from '../../redux/actions/menu/setMenuOnSelectAction';
import {
    HERO_SPRITE_NAME,
    NPC_01_SPRITE_NAME,
    NPC_02_SPRITE_NAME,
    NPC_03_SPRITE_NAME,
    NPC_04_SPRITE_NAME,
    NPC_05_SPRITE_NAME,
} from '../../utils/constants';

export default class MainMenuScene extends Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() {
        // TODO
    }

    create() {
        const { dispatch } = store;

        dispatch(setMenuItemsAction(['Start Game', 'Exit']));
        dispatch(setMenuOnSelectAction((item) => {
            if (item === 'Start Game') {
                dispatch(setMenuItemsAction([]));
                dispatch(setMenuOnSelectAction(null));
                this.scene.start('LoadAssetsScene', {
                    nextScene: 'PlayerSelectionScene',
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
            } else {
                dispatch(setMenuItemsAction([]));
                dispatch(setMenuOnSelectAction(null));
                window.location.reload();
            }
        }));
    }
}
