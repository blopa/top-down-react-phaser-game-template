import { Scene, Input } from 'phaser';

// Constants
import {
    KEY,
    COIN,
    HEART,
    ENEMY,
    CRYSTAL,
    TILE_WIDTH,
    IDLE_FRAME,
    TILE_HEIGHT,
    UP_DIRECTION,
    DOWN_DIRECTION,
    LEFT_DIRECTION,
    RIGHT_DIRECTION,
    KEY_SPRITE_NAME,
    HERO_SPRITE_NAME,
    COIN_SPRITE_NAME,
    ENEMY_SPRITE_NAME,
    HEART_SPRITE_NAME,
    CRYSTAL_SPRITE_NAME,
} from '../../constants';

// Utils
import { createWalkingAnimation } from '../../utils/sceneHelpers';

// Store
import store from '../../redux/store';

// Selectors
import { selectMapKey, selectTilesets } from '../../redux/selectors/selectMapData';
import {
    selectHeroInitialFrame,
    selectHeroFacingDirection,
    selectHeroInitialPosition,
} from '../../redux/selectors/selectHeroData';
import { createInteractiveGameObject } from '../../utils/utils';

export default class GameScene extends Scene {
    constructor() {
        super('GameScene');
    }

    init(sceneData) {
        this.sceneData = sceneData;
    }

    create() {
        // Store stuff
        const { getState, dispatch } = store;
        const state = getState();

        // Game variables
        const camera = this.cameras.main;
        const { game } = this.sys;

        // Map data
        const mapKey = selectMapKey(state);
        const tilesets = selectTilesets(state);

        // Hero data
        const initialFrame = selectHeroInitialFrame(state);
        const initialPosition = selectHeroInitialPosition(state);
        const facingDirection = selectHeroFacingDirection(state);

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
        this.enemies = this.add.group();
        this.items = this.add.group();

        // Create the map
        const map = this.make.tilemap({ key: mapKey });
        tilesets.forEach((tilesetName) => {
            map.addTilesetImage(tilesetName, tilesetName);
        });

        map.layers.forEach((layerData, index) => {
            const layer = map.createLayer(layerData.name, tilesets, 0, 0);
        });

        // Create hero sprite
        this.heroSprite = this.physics.add
            .sprite(0, 0, HERO_SPRITE_NAME, initialFrame)
            .setName(HERO_SPRITE_NAME)
            .setDepth(1);

        const actionColliderSizeOffset = 2;
        this.heroSprite.actionCollider = createInteractiveGameObject(
            this,
            0,
            0,
            TILE_WIDTH - actionColliderSizeOffset,
            TILE_HEIGHT - actionColliderSizeOffset,
            true
        );

        this.heroSprite.update = (time, delta) => {
            const facingDirection = this.gridEngine.getFacingDirection(HERO_SPRITE_NAME);

            switch (facingDirection) {
                case DOWN_DIRECTION: {
                    this.heroSprite.actionCollider.setX(
                        this.heroSprite.x + (actionColliderSizeOffset / 2)
                    );
                    this.heroSprite.actionCollider.setY(
                        this.heroSprite.y + TILE_HEIGHT
                    );

                    break;
                }

                case UP_DIRECTION: {
                    this.heroSprite.actionCollider.setX(
                        this.heroSprite.x + (actionColliderSizeOffset / 2)
                    );
                    this.heroSprite.actionCollider.setY(
                        this.heroSprite.y - TILE_HEIGHT + (actionColliderSizeOffset / 2)
                    );

                    break;
                }

                case LEFT_DIRECTION: {
                    this.heroSprite.actionCollider.setX(
                        this.heroSprite.x - TILE_HEIGHT + (actionColliderSizeOffset / 2)
                    );
                    this.heroSprite.actionCollider.setY(
                        this.heroSprite.y + (actionColliderSizeOffset / 2)
                    );

                    break;
                }

                case RIGHT_DIRECTION: {
                    this.heroSprite.actionCollider.setX(
                        this.heroSprite.x + TILE_WIDTH + (actionColliderSizeOffset / 2)
                    );
                    this.heroSprite.actionCollider.setY(
                        this.heroSprite.y + (actionColliderSizeOffset / 2)
                    );

                    break;
                }

                default: {
                    break;
                }
            }
        };

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
                facingDirection,
            }],
        });

        // Load game objects like items, enemies, etc
        map.objects.forEach((objectLayerData, layerIndex) => {
            objectLayerData?.objects?.forEach((object, objectIndex) => {
                const { gid, properties, x, y } = object;

                switch (gid) {
                    case ENEMY: {
                        const name = `${ENEMY_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                        const enemy = this.physics.add
                            .sprite(x, y, ENEMY_SPRITE_NAME, IDLE_FRAME.replace('position', DOWN_DIRECTION))
                            .setName(name)
                            .setDepth(1);

                        this.sprites.add(enemy);
                        this.enemies.add(enemy);
                        this.gridEngine.addCharacter({
                            id: name,
                            offsetY: 0, // default
                            sprite: enemy,
                            startPosition: {
                                x: Math.floor(x / TILE_WIDTH),
                                y: Math.floor(y / TILE_HEIGHT),
                            },
                        });

                        break;
                    }
                    case COIN: {
                        const name = `${COIN_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                        const coin = this.physics.add
                            .sprite(x, y, COIN_SPRITE_NAME, 'coin_idle_01')
                            .setOrigin(0, 0)
                            .setName(name)
                            .setDepth(1);

                        const animationKey = `${COIN_SPRITE_NAME}_idle`;
                        if (!this.anims.exists(animationKey)) {
                            this.anims.create({
                                key: animationKey,
                                frames: Array.from({ length: 2 }).map((n, index) => ({
                                    key: COIN_SPRITE_NAME,
                                    frame: `${COIN_SPRITE_NAME}_idle_${(index + 1).toString().padStart(2, '0')}`,
                                })),
                                frameRate: 3,
                                repeat: -1,
                                yoyo: false,
                            });
                        }

                        coin.anims.play(animationKey);
                        this.items.add(coin);

                        break;
                    }
                    case HEART: {
                        const name = `${HEART_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                        const heart = this.physics.add
                            .image(x, y, HEART_SPRITE_NAME)
                            .setOrigin(0, 0)
                            .setName(name)
                            .setDepth(1);

                        this.items.add(heart);

                        break;
                    }
                    case CRYSTAL: {
                        const name = `${CRYSTAL_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                        const crystal = this.physics.add
                            .image(x, y, CRYSTAL_SPRITE_NAME)
                            .setOrigin(0, 0)
                            .setName(name)
                            .setDepth(1);

                        this.items.add(crystal);

                        break;
                    }
                    case KEY: {
                        const name = `${KEY_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                        const key = this.physics.add
                            .image(x, y, KEY_SPRITE_NAME)
                            .setOrigin(0, 0)
                            .setName(name)
                            .setDepth(1);

                        this.items.add(key);

                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
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
        [UP_DIRECTION, DOWN_DIRECTION, LEFT_DIRECTION, RIGHT_DIRECTION].forEach((direction) => {
            createWalkingAnimation(
                this,
                HERO_SPRITE_NAME,
                `walk_${direction}`,
                3
            );
        });

        // Movement started
        this.gridEngine.movementStarted().subscribe(({ charId, direction }) => {
            const char = this.sprites.getChildren().find((sprite) => sprite.name === charId);

            if (char) {
                char.anims.play(`${char.texture.key}_walk_${direction}`);
            }
        });

        // Movement ended
        this.gridEngine.movementStopped().subscribe(({ charId, direction }) => {
            const char = this.sprites.getChildren().find((sprite) => sprite.name === charId);

            if (char) {
                char.anims.stop();
                char.setFrame(IDLE_FRAME.replace('position', direction));
            }
        });

        // Direction changed
        this.gridEngine.directionChanged().subscribe(({ charId, direction }) => {
            const char = this.sprites.getChildren().find((sprite) => sprite.name === charId);

            if (char) {
                char.setFrame(IDLE_FRAME.replace('position', direction));
            }
        });
    }

    update(time, delta) {
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.gridEngine.move(HERO_SPRITE_NAME, LEFT_DIRECTION);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.gridEngine.move(HERO_SPRITE_NAME, RIGHT_DIRECTION);
        } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.gridEngine.move(HERO_SPRITE_NAME, UP_DIRECTION);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.gridEngine.move(HERO_SPRITE_NAME, DOWN_DIRECTION);
        }

        this.heroSprite.update(time, delta);
    }
}
