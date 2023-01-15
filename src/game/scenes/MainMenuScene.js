import { Scene } from 'phaser';

// Constants
import { DOWN_DIRECTION, IDLE_FRAME } from '../../constants';

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
            const { setHeroFacingDirection, setHeroInitialFrame, setHeroPreviousPosition, setHeroInitialPosition } = store.getState();

            setHeroFacingDirection(DOWN_DIRECTION);
            setHeroInitialFrame(
                IDLE_FRAME.replace('position', DOWN_DIRECTION)
            );
            setHeroInitialPosition({ x: 30, y: 42 });
            setHeroPreviousPosition({ x: 30, y: 42 });

            return Promise.all([]).then(() => {
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
