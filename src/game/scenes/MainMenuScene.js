import { Scene } from 'phaser';

// Constants
import { DOWN_DIRECTION, IDLE_FRAME } from '../../constants';
import store from '../../redux/store';

// Actions
import setMapKeyAction from '../../redux/actions/setMapKeyAction';
import setHeroFacingDirectionAction from '../../redux/actions/setHeroFacingDirectionAction';
import setHeroInitialPositionAction from '../../redux/actions/setHeroInitialPositionAction';
import setHeroPreviousPositionAction from '../../redux/actions/setHeroPreviousPositionAction';
import setHeroInitialFrameAction from '../../redux/actions/setHeroInitialFrameAction';

export default class MainMenuScene extends Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() {
        // TODO
    }

    create() {
        const { dispatch } = store;
        Promise.all([
            dispatch(setMapKeyAction('sample_map')), // sample_indoor
            dispatch(setHeroFacingDirectionAction(DOWN_DIRECTION)),
            dispatch(setHeroInitialPositionAction({ x: 30, y: 42 })),
            dispatch(setHeroPreviousPositionAction({ x: 30, y: 42 })),
            dispatch(setHeroInitialFrameAction(
                IDLE_FRAME.replace('position', 'down')
            )),
        ]).then(() => {
            this.scene.start('LoadAssetsScene', {
                nextScene: 'GameScene',
                assets: {
                    fonts: ['"Press Start 2P"'],
                    atlases: ['hero'],
                    images: [],
                    mapKey: 'sample_map',
                    // mapKey: 'sample_indoor',
                },
            });
        });
    }
}
