import { Scene } from 'phaser';

export default class BootScene extends Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Preload assets for the splash and title screens
    }

    create() {
        this.scene.start('MainMenuScene');
    }
}
