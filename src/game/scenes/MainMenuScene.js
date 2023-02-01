// Constants
import { DOWN_DIRECTION, IDLE_FRAME } from '../../constants';

// Utils
import { changeScene } from '../../utils/sceneHelpers';

// Store
import store from '../../zustand/store';

// eslint-disable-next-line import/no-mutable-exports, prefer-const
export const scene = {};

export const key = 'MainMenuScene';

export function create() {
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
        const {
            setHeroPreviousPosition,
            setHeroFacingDirection,
            setHeroInitialPosition,
            setHeroInitialFrame,
        } = store.getState();

        setHeroFacingDirection(DOWN_DIRECTION);
        setHeroInitialFrame(
            IDLE_FRAME.replace('position', DOWN_DIRECTION)
        );
        setHeroInitialPosition({ x: 30, y: 42 });
        setHeroPreviousPosition({ x: 30, y: 42 });

        changeScene(scene, 'GameScene', {
            // fonts: ['"Press Start 2P"'],
            atlases: ['hero'],
            images: [],
            mapKey: 'sample_map',
            // mapKey: 'sample_indoor',
        });
    };
}
