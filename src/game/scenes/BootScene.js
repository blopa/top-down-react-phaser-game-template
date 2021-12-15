import { Scene } from 'phaser';

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

        this.scene.start('LoadAssetsScene', {
            nextScene: 'MainMenuScene',
            assets: {
                fonts: ['"Press Start 2P"'],
            },
        });
    }
}
