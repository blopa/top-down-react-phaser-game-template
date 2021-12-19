import { Scene } from 'phaser';

// Utils
import { changeScene } from '../../utils/sceneHelpers';
import { getDispatch } from '../../utils/utils';

// Actions
import setGameDomRectAction from '../../redux/actions/gameSettings/setGameDomRectAction';

// Constants
// import { LAST_TIME_CONNECTED_DATA_KEY } from '../../utils/constants';

export default class BootScene extends Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Preload assets for the splash and title screens
    }

    create() {
        const dispatch = getDispatch();
        // localStorage.removeItem(LAST_TIME_CONNECTED_DATA_KEY);
        const domRect = this.sys.game?.canvas?.getBoundingClientRect();
        dispatch(setGameDomRectAction(domRect));

        changeScene(this, 'MainMenuScene', {
            fonts: ['"Press Start 2P"'],
        });
    }
}
