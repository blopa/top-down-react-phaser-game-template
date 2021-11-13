import { Scene } from 'phaser';

export default class TestScene extends Scene {
    constructor() {
        super('TestScene');
    }

    preload() {
        // TODO
    }

    create() {
        const fontSize = 24;
        const { width: gameWidth, height: gameHeight } = this.cameras.main;

        const gameOverText = this.add.text(
            gameWidth / 2,
            Math.ceil(gameHeight / 5),
            'game over',
            {
                fontFamily: '"Press Start 2P"',
                fontSize: `${fontSize}px`,
                size: `${fontSize}px`,
                fill: '#ffffff',
                color: '#ffffff',
            }
        ).setDepth(10).setOrigin(0.5, 0.5);
    }
}
