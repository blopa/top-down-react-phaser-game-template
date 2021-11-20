import { Scene } from 'phaser';

// Constants
import { IDLE_FRAME } from '../../constants';

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
                heroData: {
                    facingDirection: 'down',
                    initialPosition: { x: 30, y: 42 },
                    previousPosition: { x: 30, y: 42 },
                    initialFrame: IDLE_FRAME.replace('position', 'down'),
                },
                mapData: {
                    mapKey: 'sample_map',
                    // mapKey: 'sample_indoor',
                },
            },
            assets: {
                fonts: ['"Press Start 2P"'],
                atlases: ['hero'],
                images: [],
                mapKey: 'sample_map',
                // mapKey: 'sample_indoor',
            },
        });
    }
}
