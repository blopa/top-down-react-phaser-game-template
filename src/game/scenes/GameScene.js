import { Scene, Input } from 'phaser';

// Constants
import { HERO_SPRITE_NAME } from '../../constants';

// Utils
import { createWalkingAnimation } from '../../utils/sceneHelpers';

export default class GameScene extends Scene {
    constructor() {
        super('GameScene');
    }

    init(sceneData) {
        this.sceneData = sceneData;
    }

    create() {
        // Base data
        const camera = this.cameras.main;
        const { game } = this.sys;
        const { heroData, mapData } = this.sceneData;
        const { mapKey, tilesets } = mapData;
        const {
            initialFrame,
            initialPosition,
        } = heroData;

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Input.Keyboard.KeyCodes.W,
            down: Input.Keyboard.KeyCodes.S,
            left: Input.Keyboard.KeyCodes.A,
            right: Input.Keyboard.KeyCodes.D,
        });

        // Game groups
        this.sprites = this.add.group();

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

        // Create hero sprite
        this.heroSprite = this.physics.add
            .sprite(0, 0, HERO_SPRITE_NAME, initialFrame)
            .setDepth(1);
        this.sprites.add(this.heroSprite);

        // Grid Engine
        this.gridEngine.create(map, {
            characterCollisionStrategy: 'BLOCK_TWO_TILES', // default
            collisionTilePropertyName: 'ge_collide', // default
            numberOfDirections: 4, // default
            characters: [{
                id: HERO_SPRITE_NAME,
                offsetY: 0, // default
                sprite: this.heroSprite,
                startPosition: initialPosition,
            }],
        });

        // Configure the main camera
        camera.startFollow(this.heroSprite, true);
        camera.setFollowOffset(-this.heroSprite.width, -this.heroSprite.height);
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

        // Animations
        ['up', 'down', 'left', 'right'].forEach((direction) => {
            createWalkingAnimation(
                this,
                HERO_SPRITE_NAME,
                `walk_${direction}`,
                3
            );
        });

        // Movement started
        this.gridEngine.movementStarted().subscribe(({ charId, direction }) => {
            const char = this.sprites.getChildren().find((sprite) => sprite.texture.key === charId);

            if (char) {
                char.anims.play(`${charId}_walk_${direction}`);
            }
        });

        // Movement ended
        this.gridEngine.movementStopped().subscribe(({ charId, direction }) => {
            const char = this.sprites.getChildren().find((sprite) => sprite.texture.key === charId);

            if (char) {
                char.anims.stop();
                char.setFrame(`walk_${direction}_02`);
            }
        });
    }

    update() {
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.gridEngine.move(HERO_SPRITE_NAME, 'left');
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.gridEngine.move(HERO_SPRITE_NAME, 'right');
        } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.gridEngine.move(HERO_SPRITE_NAME, 'up');
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.gridEngine.move(HERO_SPRITE_NAME, 'down');
        }
    }
}
