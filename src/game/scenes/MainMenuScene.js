import { Scene } from 'phaser';

// Constants
import { DOWN_DIRECTION, IDLE_FRAME } from '../../constants';

// Actions
import setMapKeyAction from '../../redux/actions/mapData/setMapKeyAction';
import setHeroFacingDirectionAction from '../../redux/actions/heroData/setHeroFacingDirectionAction';
import setHeroInitialPositionAction from '../../redux/actions/heroData/setHeroInitialPositionAction';
import setHeroPreviousPositionAction from '../../redux/actions/heroData/setHeroPreviousPositionAction';
import setHeroInitialFrameAction from '../../redux/actions/heroData/setHeroInitialFrameAction';
import setMenuItemsAction from '../../redux/actions/menu/setMenuItemsAction';
import setMenuOnSelectAction from '../../redux/actions/menu/setMenuOnSelectAction';

// Utils
import { changeScene } from '../../utils/sceneHelpers';
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

        dispatch(setMenuItemsAction(['start_game', 'exit']));
        dispatch(setMenuOnSelectAction((key, item) => {
            if (key === 'start_game') {
                handleStartGameSelected();
            } else {
                dispatch(setMenuItemsAction([]));
                dispatch(setMenuOnSelectAction(null));
                window.location.reload();
            }
        }));

        const handleStartGameSelected = () => Promise.all([
            dispatch(setMenuItemsAction([])),
            dispatch(setMenuOnSelectAction(null)),
            dispatch(setMapKeyAction('sample_map')), // sample_indoor
            dispatch(setHeroFacingDirectionAction(DOWN_DIRECTION)),
            dispatch(setHeroInitialPositionAction({ x: 30, y: 42 })),
            dispatch(setHeroPreviousPositionAction({ x: 30, y: 42 })),
            dispatch(setHeroInitialFrameAction(
                IDLE_FRAME.replace('position', DOWN_DIRECTION)
            )),
        ]).then(() => {
            changeScene(this, 'GameScene', {
                // fonts: ['"Press Start 2P"'],
                atlases: ['hero'],
                images: [],
                mapKey: 'sample_map',
                // mapKey: 'sample_indoor',
            });
        });
    }
}
