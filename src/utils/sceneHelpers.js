import { Input } from 'phaser';

// Constants
import {
    KEY,
    COIN,
    DOOR,
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
    IDLE_FRAME_POSITION_KEY,
} from '../constants';

// Utils
import {
    getSelectorData,
    getDegreeFromRadians,
    rotateRectangleInsideTile,
    createInteractiveGameObject,
} from './utils';

// Selectors
import { selectDialogMessages, selectDialogSetters } from '../zustand/dialog/selectDialog';
import { selectMapKey, selectTilesets, selectMapSetters } from '../zustand/map/selectMapData';
import {
    selectHeroSetters,
    selectHeroInitialFrame,
    selectHeroInitialPosition,
    selectHeroFacingDirection,
} from '../zustand/hero/selectHeroData';
import { selectTextSetters } from '../zustand/text/selectText';

export const createWalkingAnimation = (scene, assetKey, animationName, frameQuantity) => {
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

export const handleCreateControls = (scene) => {
    // Controls
    // eslint-disable-next-line no-param-reassign
    scene.actionKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
    // eslint-disable-next-line no-param-reassign
    scene.cursors = scene.input.keyboard.createCursorKeys();
    // eslint-disable-next-line no-param-reassign
    scene.wasd = scene.input.keyboard.addKeys({
        [UP_DIRECTION]: Input.Keyboard.KeyCodes.W,
        [DOWN_DIRECTION]: Input.Keyboard.KeyCodes.S,
        [LEFT_DIRECTION]: Input.Keyboard.KeyCodes.A,
        [RIGHT_DIRECTION]: Input.Keyboard.KeyCodes.D,
    });
};

export const handleCreateGroups = (scene) => {
    // Game groups
    // eslint-disable-next-line no-param-reassign
    scene.sprites = scene.add.group();
    // eslint-disable-next-line no-param-reassign
    scene.enemies = scene.add.group();
    // eslint-disable-next-line no-param-reassign
    scene.items = scene.add.group();
    // eslint-disable-next-line no-param-reassign
    scene.mapLayers = scene.add.group();
};

/**
 * @param scene
 * @returns Phaser.GameObjects.Group
 */
export const handleCreateMap = (scene) => {
    const mapKey = getSelectorData(selectMapKey);
    const tilesets = getSelectorData(selectTilesets);
    const customColliders = scene.add.group();

    // Create the map
    const map = scene.make.tilemap({ key: mapKey });
    tilesets.forEach((tilesetName) => {
        map.addTilesetImage(tilesetName, tilesetName);
    });

    map.layers.forEach((layerData, idx) => {
        const layer = map.createLayer(layerData.name, tilesets, 0, 0);

        layer.layer.data.forEach((tileRows) => {
            tileRows.forEach((tile) => {
                const { index, tileset, properties } = tile;
                const { collideLeft, collideRight, collideUp, collideDown } = properties;
                const tilesetCustomColliders = tileset?.getTileData?.(index);

                if (tilesetCustomColliders) {
                    const { objectgroup } = tilesetCustomColliders;
                    const { objects } = objectgroup;

                    objects?.forEach((objectData) => {
                        let { height, width, x, y, ellipse } = objectData;

                        // if the custom collider is the same size as the tile
                        // then we enable the normal tile collider from Phaser
                        if (height === TILE_HEIGHT && width === TILE_WIDTH) {
                            tile.setCollision(
                                Boolean(collideLeft),
                                Boolean(collideRight),
                                Boolean(collideUp),
                                Boolean(collideDown)
                            );
                            return;
                        }

                        const { rotation, flipX, flipY } = tile;
                        if (flipX) {
                            x = TILE_WIDTH - (x + width);
                        }
                        if (flipY) {
                            y = TILE_HEIGHT - (y + height);
                        }

                        const degree = getDegreeFromRadians(rotation);
                        [x, y, width, height] = rotateRectangleInsideTile(x, y, width, height, degree);

                        const customCollider = createInteractiveGameObject(
                            scene,
                            tile.x * TILE_WIDTH + x,
                            tile.y * TILE_HEIGHT + y,
                            width,
                            height
                        );

                        customColliders.add(customCollider);
                    });
                } else {
                    tile.setCollision(
                        Boolean(collideLeft),
                        Boolean(collideRight),
                        Boolean(collideUp),
                        Boolean(collideDown)
                    );
                }
            });
        });

        // scene.physics.add.collider(scene.heroSprite, customColliders);
        // layer.setCollisionByProperty({ collides: true });
        scene.mapLayers.add(layer);
    });

    // eslint-disable-next-line no-param-reassign
    scene.map = map;
    return customColliders;
};

export const handleCreateHero = (scene) => {
    const initialFrame = getSelectorData(selectHeroInitialFrame);
    const initialPosition = getSelectorData(selectHeroInitialPosition);
    const { x, y } = initialPosition;

    // Create hero sprite
    const heroSprite = scene.physics.add
        .sprite(x * TILE_WIDTH, y * TILE_HEIGHT, HERO_SPRITE_NAME, initialFrame)
        .setName(HERO_SPRITE_NAME)
        .setOrigin(0, 0)
        .setDepth(1);

    heroSprite.body.width = 10;
    heroSprite.body.height = 8;
    heroSprite.body.setOffset(3, 8);

    // const facingDirection = getSelectorData(selectHeroFacingDirection);
    // heroSprite.setFrame(
    //     IDLE_FRAME.replace(IDLE_FRAME_POSITION_KEY, facingDirection)
    // );

    scene.physics.add.collider(heroSprite, scene.mapLayers);
    const actionColliderSizeOffset = 10;
    heroSprite.actionCollider = createInteractiveGameObject(
        scene,
        0,
        0,
        TILE_WIDTH - actionColliderSizeOffset,
        TILE_HEIGHT - actionColliderSizeOffset
    );

    // heroSprite.attackCollider = createInteractiveGameObject(
    //     scene,
    //     0,
    //     0,
    //     TILE_WIDTH,
    //     TILE_HEIGHT
    // );

    const updateActionCollider = ({ top, right, bottom, left, width, height } = heroSprite.body) => {
        const facingDirection = getSelectorData(selectHeroFacingDirection);

        switch (facingDirection) {
            case DOWN_DIRECTION: {
                heroSprite.actionCollider.setX(left + actionColliderSizeOffset / 2 - (heroSprite.width - width) / 2);
                heroSprite.actionCollider.setY(bottom);

                // heroSprite.attackCollider.setX(left);
                // heroSprite.attackCollider.setY(bottom);

                break;
            }

            case UP_DIRECTION: {
                heroSprite.actionCollider.setX(left + actionColliderSizeOffset / 2 - (heroSprite.width - width) / 2);
                heroSprite.actionCollider.setY(top - height + actionColliderSizeOffset - (heroSprite.height - height));

                // heroSprite.attackCollider.setX(left);
                // heroSprite.attackCollider.setY(top - height);

                break;
            }

            case LEFT_DIRECTION: {
                heroSprite.actionCollider.setX(left - width + actionColliderSizeOffset - (heroSprite.width - width));
                heroSprite.actionCollider.setY(top + actionColliderSizeOffset / 2 - (heroSprite.height - height) / 2);

                // heroSprite.attackCollider.setX(left - width);
                // heroSprite.attackCollider.setY(top);

                break;
            }

            case RIGHT_DIRECTION: {
                heroSprite.actionCollider.setX(right);
                heroSprite.actionCollider.setY(top + actionColliderSizeOffset / 2 - (heroSprite.height - height) / 2);

                // heroSprite.attackCollider.setX(right);
                // heroSprite.attackCollider.setY(top);

                break;
            }

            default: {
                break;
            }
        }
    };

    // in the first render, the body is still not in its proper place
    // so let's use the sprite bounds
    updateActionCollider(heroSprite.getBounds());
    heroSprite.update = (time, delta) => {
        if (heroSprite.body.velocity.y === 0 && heroSprite.body.velocity.x === 0) {
            return;
        }

        updateActionCollider();
    };

    // eslint-disable-next-line no-param-reassign
    scene.heroSprite = heroSprite;
    scene.sprites.add(heroSprite);
};

export const handleObjectsLayer = (scene) => {
    // Load game objects like items, enemies, etc
    scene.map.objects.forEach((objectLayerData, layerIndex) => {
        objectLayerData?.objects?.forEach((object, objectIndex) => {
            const { gid, properties, x, y, name, width, height } = object;
            const propertiesObject = Object.fromEntries(properties?.map((curr) => [curr.name, curr.value]) || []);

            switch (gid || name) {
                case ENEMY: {
                    const spriteName = `${ENEMY_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const enemy = scene.physics.add
                        .sprite(x, y, ENEMY_SPRITE_NAME, IDLE_FRAME.replace(IDLE_FRAME_POSITION_KEY, DOWN_DIRECTION))
                        .setName(spriteName)
                        .setOrigin(0, 1)
                        .setDepth(1);

                    enemy.body.setImmovable(true);
                    scene.sprites.add(enemy);
                    scene.enemies.add(enemy);

                    enemy.setInteractive();
                    enemy.on('pointerdown', () => {
                        const { setTextTexts } = getSelectorData(selectTextSetters);
                        setTextTexts([{
                            key: 'game_title',
                            variables: {},
                            config: {},
                        }]);
                    });

                    const enemyActionHeroCollider = scene.physics.add.overlap(
                        enemy,
                        scene.heroSprite.actionCollider,
                        (e, a) => {
                            if (Input.Keyboard.JustDown(scene.actionKey)) {
                                const {
                                    setDialogAction,
                                    setDialogMessages,
                                    setDialogCharacterName,
                                } = getSelectorData(selectDialogSetters);
                                const dialogMessages = getSelectorData(selectDialogMessages);

                                if (dialogMessages.length === 0) {
                                    enemyActionHeroCollider.active = false;
                                    setDialogCharacterName('monster');
                                    setDialogMessages([
                                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                                        'Praesent id neque sodales, feugiat tortor non, fringilla ex.',
                                        'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
                                    ]);
                                    setDialogAction(() => {
                                        // Do this to not trigger the message again
                                        // Because whenever you call JustDown once, the second time
                                        // you call it, it will be false
                                        Input.Keyboard.JustDown(scene.actionKey);
                                        setDialogCharacterName('');
                                        setDialogMessages([]);
                                        setDialogAction(null);
                                    });

                                    scene.time.delayedCall(0, () => {
                                        enemyActionHeroCollider.active = true;
                                    });
                                }
                            }
                        }
                    );

                    break;
                }

                case COIN: {
                    const spriteName = `${COIN_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const coin = scene.physics.add
                        .sprite(x, y, COIN_SPRITE_NAME, 'coin_idle_01')
                        .setOrigin(0, 1)
                        .setName(spriteName)
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
                    scene.items.add(coin);

                    break;
                }

                case HEART: {
                    const spriteName = `${HEART_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const heart = scene.physics.add
                        .image(x, y, HEART_SPRITE_NAME)
                        .setOrigin(0, 1)
                        .setName(spriteName)
                        .setDepth(1);

                    scene.items.add(heart);

                    break;
                }

                case CRYSTAL: {
                    const spriteName = `${CRYSTAL_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const crystal = scene.physics.add
                        .image(x, y, CRYSTAL_SPRITE_NAME)
                        .setOrigin(0, 1)
                        .setName(spriteName)
                        .setDepth(1);

                    scene.items.add(crystal);

                    break;
                }

                case KEY: {
                    const spriteName = `${KEY_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const key = scene.physics.add
                        .image(x, y, KEY_SPRITE_NAME)
                        .setOrigin(0, 1)
                        .setName(spriteName)
                        .setDepth(1);

                    scene.items.add(key);

                    break;
                }

                case DOOR: {
                    const { type, map, position } = propertiesObject;
                    const customCollider = createInteractiveGameObject(scene, x, y, TILE_WIDTH, TILE_HEIGHT, {
                        x: 0,
                        y: 1,
                    });

                    const overlapCollider = scene.physics.add.overlap(scene.heroSprite, customCollider, () => {
                        scene.physics.world.removeCollider(overlapCollider);
                        const [posX, posY] = position.split(';');
                        const {
                            setHeroInitialFrame,
                            setHeroFacingDirection,
                            setHeroInitialPosition,
                            setHeroPreviousPosition,
                        } = getSelectorData(selectHeroSetters);
                        const { setMapKey } = getSelectorData(selectMapSetters);
                        const facingDirection = getSelectorData(selectHeroFacingDirection);

                        setMapKey(map);
                        setHeroFacingDirection(facingDirection);
                        setHeroInitialFrame(IDLE_FRAME.replace(IDLE_FRAME_POSITION_KEY, facingDirection));
                        setHeroInitialPosition({ x: posX, y: posY });
                        setHeroPreviousPosition({ x: posX, y: posY });

                        // scene.scene.restart();
                        changeScene(scene, 'GameScene', {
                            atlases: ['hero'],
                            images: [],
                            mapKey: map,
                        });
                    });

                    break;
                }

                // case 'encounter': {
                //     const customCollider = createInteractiveGameObject(
                //         scene,
                //         x,
                //         y,
                //         width,
                //         height
                //     );
                //
                //     const overlapCollider = scene.physics.add.overlap(scene.heroSprite, customCollider, () => {
                //         // TODO
                //     });
                //
                //     break;
                // }

                default: {
                    break;
                }
            }
        });
    });
};

export const handleConfigureCamera = (scene) => {
    const { game } = scene.sys;
    const camera = scene.cameras.main;
    // console.log(JSON.stringify(game.scale.gameSize));

    // Configure the main camera
    camera.startFollow(scene.heroSprite, true);
    camera.setFollowOffset(-scene.heroSprite.width, -scene.heroSprite.height);
    camera.setBounds(
        0,
        0,
        Math.max(scene.map.widthInPixels, game.scale.gameSize.width),
        Math.max(scene.map.heightInPixels, game.scale.gameSize.height)
    );

    if (scene.map.widthInPixels < game.scale.gameSize.width) {
        camera.setPosition((game.scale.gameSize.width - scene.map.widthInPixels) / 2);
    }

    if (scene.map.heightInPixels < game.scale.gameSize.height) {
        camera.setPosition(camera.x, (game.scale.gameSize.height - scene.map.heightInPixels) / 2);
    }
};

export const handleCreateHeroAnimations = (scene) => {
    // Animations
    [UP_DIRECTION, DOWN_DIRECTION, LEFT_DIRECTION, RIGHT_DIRECTION].forEach((direction) => {
        createWalkingAnimation(scene, HERO_SPRITE_NAME, `walk_${direction}`, 3);
    });
};

export const handleHeroMovement = (scene, heroSpeed = 60) => {
    const dialogMessages = getSelectorData(selectDialogMessages);
    if (dialogMessages.length > 0) {
        return;
    }

    const { setHeroFacingDirection } = getSelectorData(selectHeroSetters);

    if (scene.cursors.left.isDown || scene.wasd[LEFT_DIRECTION].isDown) {
        scene.heroSprite.body.setVelocityY(0);
        scene.heroSprite.body.setVelocityX(-heroSpeed);
        scene.heroSprite.anims.play(`${HERO_SPRITE_NAME}_walk_${LEFT_DIRECTION}`, true);
        setHeroFacingDirection(LEFT_DIRECTION);
    } else if (scene.cursors.right.isDown || scene.wasd[RIGHT_DIRECTION].isDown) {
        scene.heroSprite.body.setVelocityY(0);
        scene.heroSprite.body.setVelocityX(heroSpeed);
        scene.heroSprite.anims.play(`${HERO_SPRITE_NAME}_walk_${RIGHT_DIRECTION}`, true);
        setHeroFacingDirection(RIGHT_DIRECTION);
    } else if (scene.cursors.up.isDown || scene.wasd[UP_DIRECTION].isDown) {
        scene.heroSprite.body.setVelocityX(0);
        scene.heroSprite.body.setVelocityY(-heroSpeed);
        scene.heroSprite.anims.play(`${HERO_SPRITE_NAME}_walk_${UP_DIRECTION}`, true);
        setHeroFacingDirection(UP_DIRECTION);
    } else if (scene.cursors.down.isDown || scene.wasd[DOWN_DIRECTION].isDown) {
        scene.heroSprite.body.setVelocityX(0);
        scene.heroSprite.body.setVelocityY(heroSpeed);
        scene.heroSprite.anims.play(`${HERO_SPRITE_NAME}_walk_${DOWN_DIRECTION}`, true);
        setHeroFacingDirection(DOWN_DIRECTION);
    } else {
        const facingDirection = getSelectorData(selectHeroFacingDirection);
        scene.heroSprite.body.setVelocityX(0);
        scene.heroSprite.body.setVelocityY(0);
        scene.heroSprite.anims.stop();
        scene.heroSprite.setFrame(
            IDLE_FRAME.replace(IDLE_FRAME_POSITION_KEY, facingDirection)
        );
    }
};

export const changeScene = (scene, nextScene, assets = {}, config = {}) => {
    // const sceneKey = scene.scene.key;
    // scene.scene.stop(sceneKey);
    scene.scene.start('LoadAssetsScene', {
        nextScene,
        assets,
    });
};
