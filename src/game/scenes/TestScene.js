import { Loader, Scene } from 'phaser';

export default class TestScene extends Scene {
    constructor() {
        super('TestScene');
    }

    init(initData) {
        this.initData = initData;
    }

    preload() {
        // TODO
    }

    create() {
        const { heroData, mapData } = this.initData;
        const { mapKey, tilesetName } = mapData;
        const map = this.make.tilemap({ key: mapKey });
        map.addTilesetImage(tilesetName, tilesetName);
        debugger;

        map.layers.forEach((layerData) => {
            debugger;
        });

        // Delete all after this line
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
