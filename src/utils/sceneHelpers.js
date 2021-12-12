import { Input } from 'phaser';
import { v4 as uuid } from 'uuid';
import io from 'socket.io-client';

// Constants
import {
    CLOSED_BOX_TILE_INDEX,
    CRYSTAL_SPRITE_NAME,
    OPEN_BOX_TILE_INDEX,
    ENEMY_SPRITE_NAME,
    HEART_SPRITE_NAME,
    EMPTY_TILE_INDEX,
    HERO_SPRITE_NAME,
    COIN_SPRITE_NAME,
    KEY_SPRITE_NAME,
    RIGHT_DIRECTION,
    DOWN_DIRECTION,
    LEFT_DIRECTION,
    UP_DIRECTION,
    TILE_HEIGHT,
    IDLE_FRAME,
    TILE_WIDTH,
    CRYSTAL,
    ENEMY,
    HEART,
    COIN,
    KEY,
} from './constants';
import { MOVE_CHARACTER } from '../server/constants';

// Utils
import { getDispatch, getSelectorData } from './utils';
import { createInteractiveGameObject } from './phaser';

// Selectors
import { selectMapKey, selectTilesets } from '../redux/selectors/selectMapData';
import {
    selectHeroFacingDirection,
    selectHeroInitialFrame,
    selectHeroInitialPosition,
} from '../redux/selectors/selectHeroData';
import { selectGameZoom } from '../redux/selectors/selectGameSettings';

// Actions
import setMenuItemsAction from '../redux/actions/menu/setMenuItemsAction';
import setMenuOnSelectAction from '../redux/actions/menu/setMenuOnSelectAction';
import setMapKeyAction from '../redux/actions/mapData/setMapKeyAction';
import setHeroFacingDirectionAction from '../redux/actions/heroData/setHeroFacingDirectionAction';
import setHeroInitialPositionAction from '../redux/actions/heroData/setHeroInitialPositionAction';
import setHeroPreviousPositionAction from '../redux/actions/heroData/setHeroPreviousPositionAction';
import setHeroInitialFrameAction from '../redux/actions/heroData/setHeroInitialFrameAction';
import { selectMyPlayer, selectMyPlayerId, selectPlayers } from '../redux/selectors/selectPlayers';
// import { selectDialogMessages } from '../redux/selectors/selectDialog';

// Actions
// import setDialogCharacterNameAction from '../redux/actions/setDialogCharacterNameAction';
// import setDialogMessagesAction from '../redux/actions/setDialogMessagesAction';
// import setDialogActionAction from '../redux/actions/setDialogActionAction';

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

export const handleCreateCharactersMovements = (scene) => {
    // Movement started
    scene.gridEngine.movementStarted().subscribe(({ charId, direction }) => {
        const char = scene.sprites.getChildren().find((sprite) => sprite.name === charId);

        if (char) {
            char.anims.play(`${char.texture.key}_walk_${direction}`);
        }
    });

    // Movement ended
    scene.gridEngine.movementStopped().subscribe(({ charId, direction }) => {
        const char = scene.sprites.getChildren().find((sprite) => sprite.name === charId);

        if (char) {
            char.anims.stop();
            char.setFrame(IDLE_FRAME.replace('position', direction));
        }
    });

    // Direction changed
    scene.gridEngine.directionChanged().subscribe(({ charId, direction }) => {
        const char = scene.sprites.getChildren().find((sprite) => sprite.name === charId);

        if (char) {
            char.setFrame(IDLE_FRAME.replace('position', direction));
        }
    });
};

export const handleCreateControlKeys = (scene) => {
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

export const handleHeroOverlapWithItems = (scene) => {
    scene.physics.add.overlap(
        scene.heroSprite,
        scene.items,
        (heroSprie, item) => {
            const newOrigin = 0.5;
            item.setOrigin(newOrigin);
            item.setPosition(
                item.x + item.width * newOrigin,
                item.y - item.height * newOrigin
            );

            scene.items.remove(item);
            scene.tweens.add({
                targets: item,
                scale: 3,
                alpha: 0,
                ease: 'Power2',
                duration: 300,
                onComplete: () => {
                    item.setVisible(false);
                    item.destroy(true);
                },
            });
        }
    );
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
    scene.rivals = scene.add.group();
};

export const handleCreateMap = (scene) => {
    const mapKey = getSelectorData(selectMapKey);
    const tilesets = getSelectorData(selectTilesets);

    // Create the map
    const map = scene.make.tilemap({ key: mapKey });
    tilesets.forEach((tilesetName) => {
        map.addTilesetImage(tilesetName, tilesetName);
    });

    map.layers.forEach((layerData, index) => {
        const layer = map.createLayer(layerData.name, tilesets, 0, 0);
    });

    // eslint-disable-next-line no-param-reassign
    scene.map = map;
};

export const calculatePushTilePosition = (scene) => {
    const facingDirection = scene.gridEngine.getFacingDirection(scene.heroSprite.name);
    const position = scene.gridEngine.getPosition(scene.heroSprite.name);

    switch (facingDirection) {
        case UP_DIRECTION:
            return {
                x: position.x * TILE_WIDTH,
                y: (position.y - 2) * TILE_HEIGHT,
            };

        case RIGHT_DIRECTION:
            return {
                x: (position.x + 2) * TILE_WIDTH,
                y: position.y * TILE_HEIGHT,
            };

        case DOWN_DIRECTION:
            return {
                x: position.x * TILE_WIDTH,
                y: (position.y + 2) * TILE_HEIGHT,
            };

        case LEFT_DIRECTION:
            return {
                x: (position.x - 2) * TILE_WIDTH,
                y: position.y * TILE_HEIGHT,
            };

        default:
            return {
                x: position.x * TILE_WIDTH,
                y: position.y * TILE_HEIGHT,
            };
    }
};

export const handleCreateHeroPushTileAction = (scene) => {
    const mapLayers = scene.add.group();
    scene.map.layers.forEach((layer) => {
        mapLayers.add(layer.tilemapLayer);
    });

    const layersActionHeroCollider = scene.physics.add.overlap(
        scene.heroSprite.actionCollider,
        mapLayers,
        (actionCollider, tile) => {
            if ([OPEN_BOX_TILE_INDEX, CLOSED_BOX_TILE_INDEX].includes(tile?.index)
                && tile?.visible
                && tile?.alpha
                && Input.Keyboard.JustDown(scene.actionKey)
            ) {
                const newPosition = calculatePushTilePosition(scene);
                const anyTileInNewPosition = scene.map.layers.some((layer) => {
                    const t = layer.tilemapLayer.getTileAtWorldXY(
                        newPosition.x,
                        newPosition.y
                    );

                    return t?.properties?.ge_collide;
                });

                const anySpriteInNewPosition = scene.sprites.getChildren().some((sprite) =>
                    Math.floor(sprite.x) - Math.floor(sprite.width * sprite.originX) === newPosition.x
                        && Math.floor(sprite.y) - Math.floor(sprite.height * sprite.originY) === newPosition.y);

                if (!anyTileInNewPosition && !anySpriteInNewPosition) {
                    layersActionHeroCollider.active = false;
                    const {
                        properties,
                        layer,
                        pixelX,
                        pixelY,
                        x,
                        y,
                    } = tile;

                    // This function will make the tile texture move
                    // and it will change some of the tile's properties
                    scene.tweens.add({
                        targets: tile,
                        pixelX: newPosition.x,
                        pixelY: newPosition.y,
                        x: newPosition.x / TILE_WIDTH,
                        y: newPosition.y / TILE_HEIGHT,
                        ease: 'Power2', // PhaserMath.Easing
                        duration: 500,
                        onComplete: () => {
                            // TODO create the new tile before the animation is complete
                            const newTile = layer.tilemapLayer.putTileAt(
                                tile,
                                newPosition.x / TILE_WIDTH,
                                newPosition.y / TILE_HEIGHT,
                                true
                            );

                            const oldTile = layer.tilemapLayer.putTileAt(
                                EMPTY_TILE_INDEX,
                                x,
                                y,
                                true
                            );

                            // wait for Phaser to calculate everything
                            // and then in the next compilation loop
                            // set the correct properties to the new tiles
                            scene.time.delayedCall(0, () => {
                                layersActionHeroCollider.active = true;

                                // Reset the old tile to its original
                                // position, so if a new tile shows up on that spot
                                // the tile texture knows where to be rendered
                                oldTile.setVisible(false);
                                oldTile.setAlpha(0);
                                oldTile.properties = {};
                                oldTile.pixelX = pixelX;
                                oldTile.pixelY = pixelY;
                                oldTile.x = x;
                                oldTile.y = y;

                                // Make sure the new tile is visible
                                // as Phaser might get the old tile
                                // properties in case of this new tile
                                // falls into a spot where there was
                                // alredy a tile before
                                newTile.setVisible(true);
                                newTile.setAlpha(1);
                                newTile.properties = {
                                    ...properties,
                                };
                            });
                        },
                    });
                }
            }
        }
    );
};

export const handleCreateRivals = (scene) => {
    const myPlayerId = getSelectorData(selectMyPlayerId);
    const players = getSelectorData(selectPlayers);
    const initialFrame = IDLE_FRAME.replace('position', DOWN_DIRECTION);

    const rivals = players.filter((p) => p.playerId !== myPlayerId);

    rivals.forEach((rival) => {
        const rivalSprite = scene.physics.add
            .sprite(0, 0, rival.characterId, initialFrame)
            .setName(rival.playerId)
            .setDepth(1);

        scene.rivals.add(rivalSprite);
        scene.sprites.add(rivalSprite);

        scene.gridEngine.addCharacter({
            id: rivalSprite.name,
            sprite: rivalSprite,
            startPosition: rival.position,
        });
    });
};

export const handleCreateHero = (scene) => {
    // const initialFrame = getSelectorData(selectHeroInitialFrame);
    const initialFrame = IDLE_FRAME.replace('position', DOWN_DIRECTION);
    const myPlayer = getSelectorData(selectMyPlayer);

    // Create hero sprite
    const heroSprite = scene.physics.add
        .sprite(0, 0, myPlayer.characterId, initialFrame)
        .setName(myPlayer.playerId)
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
        const facingDirection = scene.gridEngine.getFacingDirection(heroSprite.name);

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

    // eslint-disable-next-line no-param-reassign
    scene.heroSprite = heroSprite;
    scene.sprites.add(heroSprite);
};

export const handleCreateHeroEnemiesOverlap = (scene) => {
    scene.physics.add.collider(
        scene.heroSprite,
        scene.enemies,
        (heroSprite, enemy) => {
            console.log('game over!!');
        }
    );
};

export const handleObjectsLayer = (scene) => {
    // Load game objects like items, enemies, etc
    const dispatch = getDispatch();
    scene.map.objects.forEach((objectLayerData, layerIndex) => {
        objectLayerData?.objects?.forEach((object, objectIndex) => {
            const { gid, properties, x, y } = object;

            switch (gid) {
                case ENEMY: {
                    const name = `${ENEMY_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const enemy = scene.physics.add
                        .sprite(x, y, ENEMY_SPRITE_NAME, IDLE_FRAME.replace('position', DOWN_DIRECTION))
                        .setOrigin(0, 1)
                        .setName(name)
                        .setDepth(1);

                    enemy.body.setSize(
                        TILE_WIDTH - 2,
                        TILE_HEIGHT - 2
                    );

                    scene.enemies.add(enemy);
                    scene.sprites.add(enemy);

                    scene.gridEngine.addCharacter({
                        id: name,
                        speed: 3,
                        offsetY: 0, // default
                        sprite: enemy,
                        startPosition: {
                            x: Math.floor(x / TILE_WIDTH),
                            y: Math.floor(y / TILE_HEIGHT) - 1,
                        },
                    });

                    scene.gridEngine.moveRandomly(name, 1000);
                    // const enemyActionHeroCollider = scene.physics.add.overlap(
                    //     enemy,
                    //     scene.heroSprite.actionCollider,
                    //     (e, a) => {
                    //         if (Input.Keyboard.JustDown(scene.actionKey)) {
                    //             const messages = getSelectorData(selectDialogMessages);
                    //
                    //             if (messages.length === 0) {
                    //                 enemyActionHeroCollider.active = false;
                    //                 dispatch(setDialogCharacterNameAction('monster'));
                    //                 dispatch(setDialogMessagesAction([
                    //                     'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    //                     'Praesent id neque sodales, feugiat tortor non, fringilla ex.',
                    //                     'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
                    //                 ]));
                    //                 dispatch(setDialogActionAction(() => {
                    //                     // Do this to not trigger the message again
                    //                     // Because whenever you call JustDown once, the second time
                    //                     // you call it, it will be false
                    //                     Input.Keyboard.JustDown(scene.actionKey);
                    //                     dispatch(setDialogCharacterNameAction(''));
                    //                     dispatch(setDialogMessagesAction([]));
                    //                     dispatch(setDialogActionAction(null));
                    //                 }));
                    //
                    //                 scene.time.delayedCall(0, () => {
                    //                     enemyActionHeroCollider.active = true;
                    //                 });
                    //             }
                    //         }
                    //     }
                    // );

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
                    scene.items.add(coin);
                    scene.sprites.add(coin);

                    break;
                }

                case HEART: {
                    const name = `${HEART_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const heart = scene.physics.add
                        .image(x, y, HEART_SPRITE_NAME)
                        .setOrigin(0, 0)
                        .setName(name)
                        .setDepth(1);

                    scene.items.add(heart);
                    scene.sprites.add(heart);

                    break;
                }

                case CRYSTAL: {
                    const name = `${CRYSTAL_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const crystal = scene.physics.add
                        .image(x, y, CRYSTAL_SPRITE_NAME)
                        .setOrigin(0, 1)
                        .setName(name)
                        .setDepth(1);

                    crystal.body.setSize(
                        TILE_WIDTH - 2,
                        TILE_HEIGHT - 2
                    );
                    scene.items.add(crystal);
                    scene.sprites.add(crystal);

                    break;
                }

                case KEY: {
                    const name = `${KEY_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const key = scene.physics.add
                        .image(x, y, KEY_SPRITE_NAME)
                        .setOrigin(0, 0)
                        .setName(name)
                        .setDepth(1);

                    scene.items.add(key);
                    scene.sprites.add(key);

                    break;
                }
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
    const gameZoom = getSelectorData(selectGameZoom);

    // Configure the main camera
    camera.startFollow(scene.heroSprite, true);
    camera.setFollowOffset(-scene.heroSprite.width, -scene.heroSprite.height);
    camera.setBounds(
        0,
        0,
        Math.max(scene.map.widthInPixels, game.scale.gameSize.width),
        Math.max(scene.map.heightInPixels, game.scale.gameSize.height)
    );

    if (
        scene.map.widthInPixels < game.scale.gameSize.width
        && window.innerWidth > scene.map.widthInPixels * gameZoom
    ) {
        camera.setPosition(
            (game.scale.gameSize.width - scene.map.widthInPixels) / 2,
            camera.y
        );
    }

    if (
        scene.map.heightInPixels < game.scale.gameSize.height
        && window.innerHeight > scene.map.heightInPixels * gameZoom
    ) {
        camera.setPosition(
            camera.x,
            (game.scale.gameSize.height - scene.map.heightInPixels) / 2
        );
    }
};

export const handleCreateHeroAnimations = (scene, spriteName = HERO_SPRITE_NAME) => {
    // Animations
    [UP_DIRECTION, DOWN_DIRECTION, LEFT_DIRECTION, RIGHT_DIRECTION].forEach((direction) => {
        createWalkingAnimation(
            scene,
            spriteName,
            `walk_${direction}`,
            3
        );
    });
};

export const handleCreateEnemiesAnimations = (scene) => {
    // Animations
    [UP_DIRECTION, DOWN_DIRECTION, LEFT_DIRECTION, RIGHT_DIRECTION].forEach((direction) => {
        createWalkingAnimation(
            scene,
            ENEMY_SPRITE_NAME,
            `walk_${direction}`,
            3
        );
    });
};

export const handleConfigureGridEngine = (scene) => {
    const facingDirection = getSelectorData(selectHeroFacingDirection);
    const myPlayer = getSelectorData(selectMyPlayer);

    // Grid Engine
    scene.gridEngine.create(scene.map, {
        characterCollisionStrategy: 'BLOCK_TWO_TILES', // default
        collisionTilePropertyName: 'ge_collide', // default
        numberOfDirections: 4, // default
        characters: [{
            id: scene.heroSprite.name,
            offsetY: 0, // default
            sprite: scene.heroSprite,
            startPosition: myPlayer.position,
            facingDirection,
        }],
    });
};

export const handleHeroMovement = (scene) => {
    const socket = connectToServer();

    if (scene.cursors.left.isDown || scene.wasd[LEFT_DIRECTION].isDown) {
        // scene.gridEngine.move(scene.heroSprite.name, LEFT_DIRECTION);
        socket.emit(MOVE_CHARACTER, JSON.stringify({
            playerId: scene.heroSprite.name,
            direction: LEFT_DIRECTION,
        }));
    } else if (scene.cursors.right.isDown || scene.wasd[RIGHT_DIRECTION].isDown) {
        // scene.gridEngine.move(scene.heroSprite.name, RIGHT_DIRECTION);
        socket.emit(MOVE_CHARACTER, JSON.stringify({
            playerId: scene.heroSprite.name,
            direction: RIGHT_DIRECTION,
        }));
    } else if (scene.cursors.up.isDown || scene.wasd[UP_DIRECTION].isDown) {
        // scene.gridEngine.move(scene.heroSprite.name, UP_DIRECTION);
        socket.emit(MOVE_CHARACTER, JSON.stringify({
            playerId: scene.heroSprite.name,
            direction: UP_DIRECTION,
        }));
    } else if (scene.cursors.down.isDown || scene.wasd[DOWN_DIRECTION].isDown) {
        // scene.gridEngine.move(scene.heroSprite.name, DOWN_DIRECTION);
        socket.emit(MOVE_CHARACTER, JSON.stringify({
            playerId: scene.heroSprite.name,
            direction: DOWN_DIRECTION,
        }));
    }
};

const localState = {};
export const applyLocalState = (defaultValue) => {
    const stateId = uuid();
    const setState = (newStateValue) => {
        localState[stateId] = newStateValue;
    };

    const getState = () => localState[stateId] || defaultValue;

    return [
        getState,
        setState,
        stateId,
    ];
};

export const purgeLocalStates = (stateIds) =>
    stateIds.forEach((stateId) => purgeLocalState(stateId));

export const purgeLocalState = (stateId) => {
    delete localState[stateId];
};

let socketIo = null;
export const connectToServer = () => {
    if (!socketIo) {
        const host = process.env.REACT_APP_SERVER_HOST;
        const port = process.env.REACT_APP_SERVER_PORT;

        socketIo = io(`${host}:${port}`);
    }

    return socketIo;
};

export const startGameScene = (scene, map, beforeStartScene) => {
    const dispatch = getDispatch();

    Promise.all([
        dispatch(setMenuItemsAction([])),
        dispatch(setMenuOnSelectAction(null)),
        dispatch(setMapKeyAction(map)),
        dispatch(setHeroFacingDirectionAction(DOWN_DIRECTION)),
        // dispatch(setHeroInitialPositionAction({ x: 0, y: 0 })),
        // dispatch(setHeroPreviousPositionAction({ x: 0, y: 0 })),
        // dispatch(setHeroInitialFrameAction(
        //     IDLE_FRAME.replace('position', DOWN_DIRECTION)
        // )),
    ]).then(async () => {
        await beforeStartScene?.();

        scene.scene.start('LoadAssetsScene', {
            nextScene: 'GameScene',
            assets: {
                mapKey: map,
            },
        });
    });
};
