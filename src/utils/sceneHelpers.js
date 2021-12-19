import { Input } from 'phaser';
import { v4 as uuid } from 'uuid';
import io from 'socket.io-client';

// Constants
import {
    LAST_TIME_CONNECTED_THRESHOLD,
    LAST_TIME_CONNECTED_DATA_KEY,
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
import {
    REQUEST_PUSH_TILE,
    RESPOND_TILE_PUSHED,
    REQUEST_COLLECT_ITEM,
    REQUEST_MOVE_CHARACTER,
    RESPOND_MOVE_CHARACTER,
    RESPOND_ITEM_COLLECTED,
} from '../server/constants';

// Utils
import { getDispatch, getSelectorData } from './utils';
import { createInteractiveGameObject } from './phaser';

// Selectors
import { selectMapKey, selectTilesets } from '../redux/selectors/selectMapData';
import { selectHeroFacingDirection } from '../redux/selectors/selectHeroData';
import { selectGameZoom } from '../redux/selectors/selectGameSettings';

// Actions
import setMenuItemsAction from '../redux/actions/menu/setMenuItemsAction';
import setMenuOnSelectAction from '../redux/actions/menu/setMenuOnSelectAction';
import setMapKeyAction from '../redux/actions/mapData/setMapKeyAction';
import setHeroFacingDirectionAction from '../redux/actions/heroData/setHeroFacingDirectionAction';
import { selectMyPlayer, selectMyPlayerId, selectPlayers } from '../redux/selectors/selectPlayers';
import setItemCollectedAction from '../redux/actions/players/setItemCollectedAction';
import { selectGameCurrentRoomId } from '../redux/selectors/selectGameManager';

/**
 * @param scene
 * @param assetKey
 * @param animationName
 * @param frameQuantity
 */
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
    const socket = connectToServer();
    const myPlayerId = getSelectorData(selectMyPlayerId);

    // Movement started
    scene.gridEngine.movementStarted().subscribe(({ charId, direction }) => {
        const char = scene.sprites.getChildren().find((sprite) => sprite.name === charId);
        char?.anims.play(`${char.texture.key}_walk_${direction}`);
    });

    // Position changed
    scene.gridEngine.positionChangeStarted().subscribe(({
        charId,
        exitTile,
        enterTile,
        exitLayer,
        enterLayer,
    }) => {
        if (charId !== myPlayerId) {
            return;
        }

        // const char = scene.sprites.getChildren().find((sprite) => sprite.name === charId);
        socket.emit(REQUEST_MOVE_CHARACTER, JSON.stringify({
            playerId: charId,
            position: enterTile,
        }));
    });

    // Movement ended
    scene.gridEngine.movementStopped().subscribe(({ charId, direction }) => {
        const char = scene.sprites.getChildren().find((sprite) => sprite.name === charId);
        char?.anims.stop();
        char?.setFrame(IDLE_FRAME.replace('position', direction));
    });

    // Direction changed
    scene.gridEngine.directionChanged().subscribe(({ charId, direction }) => {
        const char = scene.sprites.getChildren().find((sprite) => sprite.name === charId);
        char?.setFrame(IDLE_FRAME.replace('position', direction));
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

export const handleItemCollected = (scene, itemData) => {
    const {
        playerId,
        itemType,
        itemName,
        quantity,
    } = itemData;

    const item = scene.items.getChildren().find((it) => it.name === itemName);

    if (item) {
        const dispatch = getDispatch();
        const newOrigin = 0.5;
        item.collected = true;
        item.setOrigin(newOrigin);
        item.setPosition(
            item.x + item.width * newOrigin,
            item.y - item.height * newOrigin
        );

        dispatch(setItemCollectedAction({
            itemType,
            quantity,
        }));

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
};

export const handlePlayersOverlapWithItems = (scene) => {
    const socket = connectToServer();
    const myPlayerId = getSelectorData(selectMyPlayerId);

    scene.physics.add.overlap(
        scene.players,
        scene.items,
        (playerSprite, item) => {
            if (!item?.collected) {
                socket.emit(REQUEST_COLLECT_ITEM, JSON.stringify({
                    playerId: myPlayerId,
                    itemType: item.type,
                    itemName: item.name,
                    quantity: 1,
                }));
            }
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
    // eslint-disable-next-line no-param-reassign
    scene.players = scene.add.group();
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

export const handlePushTile = (scene, tileData) => {
    const {
        properties,
        pixelX,
        pixelY,
        x,
        y,
        newX,
        newY,
        layerName,
        playerId,
    } = tileData;

    const layer = scene.map.layers.find((l) => l.name === layerName);
    const tile = layer.tilemapLayer.getTileAtWorldXY(
        pixelX,
        pixelY
    );

    if (tile) {
        // Create the tile in the new position already, to block it
        const newTile = layer.tilemapLayer.putTileAt(
            tile,
            newX,
            newY,
            true
        );
        newTile.setAlpha(0);

        // set the current tile as traversable
        tile.properties = {};

        // This function will make the tile texture move
        // and it will change some of the tile's properties
        scene.tweens.add({
            targets: tile,
            pixelX: newX * TILE_WIDTH,
            pixelY: newY * TILE_HEIGHT,
            x: newX,
            y: newY,
            ease: 'Power2', // PhaserMath.Easing
            duration: 500,
            onComplete: () => {
                newTile.setAlpha(1);
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
                    // eslint-disable-next-line no-param-reassign
                    scene.layersActionHeroCollider.active = true;

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
};

export const handleCreateHeroPushTileAction = (scene) => {
    const myPlayerId = getSelectorData(selectMyPlayerId);
    const mapLayers = scene.add.group();
    scene.map.layers.forEach((layer) => {
        mapLayers.add(layer.tilemapLayer);
    });

    // eslint-disable-next-line no-param-reassign
    scene.layersActionHeroCollider = scene.physics.add.overlap(
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
                    // eslint-disable-next-line no-param-reassign
                    scene.layersActionHeroCollider.active = false;
                    const {
                        properties,
                        layer,
                        pixelX,
                        pixelY,
                        x,
                        y,
                    } = tile;

                    const socket = connectToServer();
                    socket.emit(REQUEST_PUSH_TILE, JSON.stringify({
                        playerId: myPlayerId,
                        properties,
                        pixelX,
                        pixelY,
                        x,
                        y,
                        newX: newPosition.x / TILE_WIDTH,
                        newY: newPosition.y / TILE_HEIGHT,
                        layerName: layer.name,
                    }));
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
        scene.players.add(rivalSprite);
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

    // TODO sometimes it breaks here because myPlayer is undefined, idk why

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
    scene.players.add(heroSprite);
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

                    coin.type = COIN_SPRITE_NAME;
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

                    heart.type = HEART_SPRITE_NAME;
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

                    crystal.type = CRYSTAL_SPRITE_NAME;
                    crystal.body.setSize(
                        TILE_WIDTH - 2,
                        TILE_HEIGHT - 2
                    );

                    // TODO add this to the other items too
                    dispatch(setItemCollectedAction({
                        itemType: CRYSTAL_SPRITE_NAME,
                        quantity: 0,
                    }));

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

                    key.type = KEY_SPRITE_NAME;
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
    if (scene.cursors.left.isDown || scene.wasd[LEFT_DIRECTION].isDown) {
        scene.gridEngine.move(scene.heroSprite.name, LEFT_DIRECTION);
    } else if (scene.cursors.right.isDown || scene.wasd[RIGHT_DIRECTION].isDown) {
        scene.gridEngine.move(scene.heroSprite.name, RIGHT_DIRECTION);
    } else if (scene.cursors.up.isDown || scene.wasd[UP_DIRECTION].isDown) {
        scene.gridEngine.move(scene.heroSprite.name, UP_DIRECTION);
    } else if (scene.cursors.down.isDown || scene.wasd[DOWN_DIRECTION].isDown) {
        scene.gridEngine.move(scene.heroSprite.name, DOWN_DIRECTION);
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
    ]).then(async () => {
        await beforeStartScene?.();

        changeScene(scene, 'GameScene', {
            mapKey: map,
        });
    });
};

export const handleLastTimeConnectedCheckpoint = (scene) => {
    const myPlayerId = getSelectorData(selectMyPlayerId);
    const roomId = getSelectorData(selectGameCurrentRoomId);
    localStorage.setItem(LAST_TIME_CONNECTED_DATA_KEY, JSON.stringify({
        lastTimeConnected: Date.now(),
        playerId: myPlayerId,
        roomId,
    }));

    const lastTimeConnectedHandler = setInterval(() => {
        localStorage.setItem(LAST_TIME_CONNECTED_DATA_KEY, JSON.stringify({
            lastTimeConnected: Date.now(),
            playerId: myPlayerId,
            roomId,
        }));
    }, LAST_TIME_CONNECTED_THRESHOLD);
};

export const handleGameplayActions = (scene) => {
    const socket = connectToServer();
    socket.on(RESPOND_MOVE_CHARACTER, (stringfiedData) => {
        const data = JSON.parse(stringfiedData);
        scene.gridEngine.moveTo(data.playerId, data.position);
    });

    socket.on(RESPOND_TILE_PUSHED, (stringfiedData) => {
        const tileData = JSON.parse(stringfiedData);
        handlePushTile(scene, tileData);
    });

    socket.on(RESPOND_ITEM_COLLECTED, (stringfiedData) => {
        const itemData = JSON.parse(stringfiedData);
        handleItemCollected(scene, itemData);
    });
};

export const changeScene = (scene, nextScene, assets = {}, config = {}) => {
    scene.scene.start('LoadAssetsScene', {
        nextScene,
        assets,
    });
};
