import { Scene } from 'phaser';

// Constants
import { DOWN_DIRECTION, IDLE_FRAME } from '../../utils/constants';

// Store
import store from '../../redux/store';

// Actions
import setMapKeyAction from '../../redux/actions/setMapKeyAction';
import setHeroFacingDirectionAction from '../../redux/actions/setHeroFacingDirectionAction';
import setHeroInitialPositionAction from '../../redux/actions/setHeroInitialPositionAction';
import setHeroPreviousPositionAction from '../../redux/actions/setHeroPreviousPositionAction';
import setHeroInitialFrameAction from '../../redux/actions/setHeroInitialFrameAction';
import setMenuItemsAction from '../../redux/actions/setMenuItemsAction';
import setMenuOnSelectAction from '../../redux/actions/setMenuOnSelectAction';

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
                handleStartGameSelected();
            } else {
                dispatch(setMenuItemsAction([]));
                dispatch(setMenuOnSelectAction(null));
                window.location.reload();
            }
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
                    // fonts: ['"Press Start 2P"'],
                    atlases: ['hero'],
                    images: [],
                    mapKey: map,
                },
            });
        });
    }
}
