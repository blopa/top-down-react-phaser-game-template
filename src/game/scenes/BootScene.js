import { Scene } from 'phaser';

export default class BootScene extends Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // TODO
    }

    create() {
        this.scene.start('LoadAssetsScene', {
            nextScene: 'TestScene',
            assets: {
                fonts: ['"Press Start 2P"'],
                atlases: [],
                images: [],
                tilemaps: [],
            },
        });
    }
}
