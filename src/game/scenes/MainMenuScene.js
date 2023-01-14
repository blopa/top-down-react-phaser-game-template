import { Scene } from 'phaser';

// Constants
import { DOWN_DIRECTION, IDLE_FRAME } from '../../constants';

// Actions
import setHeroFacingDirectionAction from '../../redux/actions/heroData/setHeroFacingDirectionAction';
import setHeroInitialPositionAction from '../../redux/actions/heroData/setHeroInitialPositionAction';
import setHeroPreviousPositionAction from '../../redux/actions/heroData/setHeroPreviousPositionAction';
import setHeroInitialFrameAction from '../../redux/actions/heroData/setHeroInitialFrameAction';

// Utils
import { changeScene } from '../../utils/sceneHelpers';
import { getDispatch } from '../../utils/utils';

// Store
import store from '../../zustand/store';

export default class MainMenuScene extends Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() {
        // TODO
    }

    create() {
        const dispatch = getDispatch();
        const { setMenuItems, setMenuOnSelect, setMapKey } = store.getState();

        setMenuItems(['start_game', 'exit']);
        setMenuOnSelect((key, item) => {
            if (key === 'start_game') {
                handleStartGameSelected();
            } else {
                setMenuItems([]);
                setMenuOnSelect(null);
                window.location.reload();
            }
        });

        const handleStartGameSelected = () => {
            setMenuItems([]);
            setMenuOnSelect(null);
            setMapKey('sample_map');

            return Promise.all([
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
        };
    }
}
