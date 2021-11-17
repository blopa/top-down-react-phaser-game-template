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
            nextScene: 'GameScene',
            sceneData: {
                heroData: {},
                mapData: {},
            },
            assets: {
                fonts: ['"Press Start 2P"'],
                atlases: [],
                images: [],
                mapKey: 'sample_map',
            },
        });
    }
}
