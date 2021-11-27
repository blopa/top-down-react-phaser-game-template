import { Input } from 'phaser';

// Constants
import {
    KEY,
    COIN,
    HEART,
    ENEMY,
    CRYSTAL,
    IDLE_FRAME,
    TILE_WIDTH,
    TILE_HEIGHT,
    UP_DIRECTION,
    LEFT_DIRECTION,
    DOWN_DIRECTION,
    RIGHT_DIRECTION,
    KEY_SPRITE_NAME,
    HERO_SPRITE_NAME,
    COIN_SPRITE_NAME,
    ENEMY_SPRITE_NAME,
    HEART_SPRITE_NAME,
    CRYSTAL_SPRITE_NAME,
} from '../constants';

// Utils
import { createInteractiveGameObject } from './utils';

/**
 * @param scene
 * @param assetKey
 * @param animationName
 * @param frameQuantity
 */
// eslint-disable-next-line import/prefer-default-export
export const createWalkingAnimation = (
    scene,
    assetKey,
    animationName,
    frameQuantity
) => {
    scene.anims.create({
        key: `${assetKey}_${animationName}`,
        frames: Array.from({ length: frameQuantity }).map((n, index) => ({
            key: assetKey,
            frame: `${animationName}_${(index + 1).toString().padStart(2, '0')}`,
        })),
        frameRate: 4,
        repeat: -1,
        yoyo: true,
    });
};

export const handleCharactersMovements = (gridEngine, sprites) => {
    // Movement started
    gridEngine.movementStarted().subscribe(({ charId, direction }) => {
        const char = sprites.getChildren().find((sprite) => sprite.name === charId);

        if (char) {
            char.anims.play(`${char.texture.key}_walk_${direction}`);
        }
    });

    // Movement ended
    gridEngine.movementStopped().subscribe(({ charId, direction }) => {
        const char = sprites.getChildren().find((sprite) => sprite.name === charId);

        if (char) {
            char.anims.stop();
            char.setFrame(IDLE_FRAME.replace('position', direction));
        }
    });

    // Direction changed
    gridEngine.directionChanged().subscribe(({ charId, direction }) => {
        const char = sprites.getChildren().find((sprite) => sprite.name === charId);

        if (char) {
            char.setFrame(IDLE_FRAME.replace('position', direction));
        }
    });
};

export const handleCreateMap = (
    scene,
    mapKey,
    tilesets
) => {
    // Create the map
    const map = scene.make.tilemap({ key: mapKey });
    tilesets.forEach((tilesetName) => {
        map.addTilesetImage(tilesetName, tilesetName);
    });

    map.layers.forEach((layerData, index) => {
        const layer = map.createLayer(layerData.name, tilesets, 0, 0);
    });

    return map;
};

export const handleCreateHero = (
    scene,
    initialFrame
) => {
    // Create hero sprite
    const heroSprite = scene.physics.add
        .sprite(0, 0, HERO_SPRITE_NAME, initialFrame)
        .setName(HERO_SPRITE_NAME)
        .setDepth(1);

    const actionColliderSizeOffset = 2;
    // eslint-disable-next-line no-param-reassign
    heroSprite.actionCollider = createInteractiveGameObject(
        scene,
        0,
        0,
        TILE_WIDTH - actionColliderSizeOffset,
        TILE_HEIGHT - actionColliderSizeOffset,
        true
    );

    // eslint-disable-next-line no-param-reassign
    heroSprite.update = (time, delta) => {
        const facingDirection = scene.gridEngine.getFacingDirection(HERO_SPRITE_NAME);

        switch (facingDirection) {
            case DOWN_DIRECTION: {
                heroSprite.actionCollider.setX(
                    heroSprite.x + (actionColliderSizeOffset / 2)
                );
                heroSprite.actionCollider.setY(
                    heroSprite.y + TILE_HEIGHT
                );

                break;
            }

            case UP_DIRECTION: {
                heroSprite.actionCollider.setX(
                    heroSprite.x + (actionColliderSizeOffset / 2)
                );
                heroSprite.actionCollider.setY(
                    heroSprite.y - TILE_HEIGHT + (actionColliderSizeOffset / 2)
                );

                break;
            }

            case LEFT_DIRECTION: {
                heroSprite.actionCollider.setX(
                    heroSprite.x - TILE_HEIGHT + (actionColliderSizeOffset / 2)
                );
                heroSprite.actionCollider.setY(
                    heroSprite.y + (actionColliderSizeOffset / 2)
                );

                break;
            }

            case RIGHT_DIRECTION: {
                heroSprite.actionCollider.setX(
                    heroSprite.x + TILE_WIDTH + (actionColliderSizeOffset / 2)
                );
                heroSprite.actionCollider.setY(
                    heroSprite.y + (actionColliderSizeOffset / 2)
                );

                break;
            }

            default: {
                break;
            }
        }
    };

    return heroSprite;
};

export const handleObjectsLayer = (
    scene,
    objectsLayer,
    heroSprite,
    spritesGroups,
    enemiesGroups,
    itemsGroups
) => {
    // Load game objects like items, enemies, etc
    objectsLayer.forEach((objectLayerData, layerIndex) => {
        objectLayerData?.objects?.forEach((object, objectIndex) => {
            const { gid, properties, x, y } = object;

            switch (gid) {
                case ENEMY: {
                    const name = `${ENEMY_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const enemy = scene.physics.add
                        .sprite(x, y, ENEMY_SPRITE_NAME, IDLE_FRAME.replace('position', DOWN_DIRECTION))
                        .setName(name)
                        .setDepth(1);

                    spritesGroups.add(enemy);
                    enemiesGroups.add(enemy);
                    scene.gridEngine.addCharacter({
                        id: name,
                        offsetY: 0, // default
                        sprite: enemy,
                        startPosition: {
                            x: Math.floor(x / TILE_WIDTH),
                            y: Math.floor(y / TILE_HEIGHT),
                        },
                    });

                    const enemyActionHeroCollider = scene.physics.add.collider(
                        enemy,
                        heroSprite.actionCollider,
                        (e, a) => {
                            if (Input.Keyboard.JustDown(scene.actionKey)) {
                                enemyActionHeroCollider.active = false;
                                console.log('action button pressed');

                                scene.time.delayedCall(0, () => {
                                    enemyActionHeroCollider.active = true;
                                });
                            }
                        }
                    );

                    break;
                }

                case COIN: {
                    const name = `${COIN_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const coin = scene.physics.add
                        .sprite(x, y, COIN_SPRITE_NAME, 'coin_idle_01')
                        .setOrigin(0, 0)
                        .setName(name)
                        .setDepth(1);

                    const animationKey = `${COIN_SPRITE_NAME}_idle`;
                    if (!scene.anims.exists(animationKey)) {
                        scene.anims.create({
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
                    itemsGroups.add(coin);

                    break;
                }

                case HEART: {
                    const name = `${HEART_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const heart = scene.physics.add
                        .image(x, y, HEART_SPRITE_NAME)
                        .setOrigin(0, 0)
                        .setName(name)
                        .setDepth(1);

                    itemsGroups.add(heart);

                    break;
                }

                case CRYSTAL: {
                    const name = `${CRYSTAL_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const crystal = scene.physics.add
                        .image(x, y, CRYSTAL_SPRITE_NAME)
                        .setOrigin(0, 0)
                        .setName(name)
                        .setDepth(1);

                    itemsGroups.add(crystal);

                    break;
                }

                case KEY: {
                    const name = `${KEY_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const key = scene.physics.add
                        .image(x, y, KEY_SPRITE_NAME)
                        .setOrigin(0, 0)
                        .setName(name)
                        .setDepth(1);

                    itemsGroups.add(key);

                    break;
                }
                default: {
                    break;
                }
            }
        });
    });
};

export const handleConfigureCamera = (
    heroSprite,
    camera,
    map,
    game
) => {
    // Configure the main camera
    camera.startFollow(heroSprite, true);
    camera.setFollowOffset(-heroSprite.width, -heroSprite.height);
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
};

export const handleAnimations = (scene) => {
    // Animations
    [UP_DIRECTION, DOWN_DIRECTION, LEFT_DIRECTION, RIGHT_DIRECTION].forEach((direction) => {
        createWalkingAnimation(
            scene,
            HERO_SPRITE_NAME,
            `walk_${direction}`,
            3
        );
    });
};
