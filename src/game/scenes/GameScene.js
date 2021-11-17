import { Scene } from 'phaser';

export default class GameScene extends Scene {
    constructor() {
        super('GameScene');
    }

    init(sceneData) {
        this.sceneData = sceneData;
    }

    create() {
        const camera = this.cameras.main;
        const { game } = this.sys;
        const { heroData, mapData } = this.sceneData;
        const { mapKey, tilesets } = mapData;

        // Create the map
        const map = this.make.tilemap({ key: mapKey });
        tilesets.forEach((tilesetName) => {
            map.addTilesetImage(tilesetName, tilesetName);
        });

        map.layers.forEach((layerData, index) => {
            const layer = map.createLayer(layerData.name, tilesets, 0, 0);
        });

        map.objects.forEach((objectLayerData, index) => {
            // TODO
        });

        // Configure the main camera
        // camera.startFollow(this.heroSprite, true);
        // camera.setFollowOffset(-this.heroSprite.width, -this.heroSprite.height);
        camera.setBounds(
            0,
            0,
            Math.max(map.widthInPixels, game.scale.gameSize.width),
            Math.max(map.heightInPixels, game.scale.gameSize.height)
        );

        if (map.widthInPixels < game.scale.gameSize.width) {
            camera.setPosition(
                (game.scale.gameSize.width - map.widthInPixels) / 2
            );
        }

        if (map.heightInPixels < game.scale.gameSize.height) {
            camera.setPosition(
                camera.x,
                (game.scale.gameSize.height - map.heightInPixels) / 2
            );
        }
    }
}
