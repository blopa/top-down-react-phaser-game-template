import { Scene } from 'phaser';

// Utils
import { changeScene } from '../../utils/sceneHelpers';

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
        // localStorage.removeItem(LAST_TIME_CONNECTED_DATA_KEY);

        changeScene(this, 'MainMenuScene', {
            fonts: ['"Press Start 2P"'],
        });
    }
}
