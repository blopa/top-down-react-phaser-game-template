// Constants
import { DOWN_DIRECTION, IDLE_FRAME, IDLE_FRAME_POSITION_KEY } from '../../constants';

// Utils
import { changeScene } from '../../utils/sceneHelpers';
import { getSelectorData } from '../../utils/utils';

// Selectors
import { selectHeroSetters } from '../../zustand/hero/selectHeroData';
import { selectMapSetters } from '../../zustand/map/selectMapData';
import { selectMenuSetters } from '../../zustand/menu/selectMenu';

export const scene = {};

export const key = 'MainMenuScene';

export function create() {
    const { setMapKey } = getSelectorData(selectMapSetters);
    const { setMenuItems, setMenuOnSelect } = getSelectorData(selectMenuSetters);

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
        } = getSelectorData(selectHeroSetters);

        setHeroFacingDirection(DOWN_DIRECTION);
        setHeroInitialFrame(
            IDLE_FRAME.replace(IDLE_FRAME_POSITION_KEY, DOWN_DIRECTION)
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
