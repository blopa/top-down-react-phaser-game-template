import { Scene } from 'phaser';

// Utils
import { changeScene } from '../../utils/sceneHelpers';

export default class BootScene extends Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Preload assets for the splash and title screens
    }

    create() {
        changeScene(this, 'MainMenuScene', {
            fonts: ['"Press Start 2P"'],
        });
    }
}
