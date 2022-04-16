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
} from '../constants';

// Utils
import {
    getDispatch,
    createInteractiveGameObject,
} from './utils';

// Store
import store from '../redux/store';

// Selectors
import { selectMapKey, selectTilesets } from '../redux/selectors/selectMapData';
import {
    selectHeroInitialFrame,
    selectHeroFacingDirection,
    selectHeroInitialPosition,
} from '../redux/selectors/selectHeroData';
import { selectDialogMessages } from '../redux/selectors/selectDialog';

// Actions
import setDialogCharacterNameAction from '../redux/actions/dialog/setDialogCharacterNameAction';
import setDialogMessagesAction from '../redux/actions/dialog/setDialogMessagesAction';
import setDialogActionAction from '../redux/actions/dialog/setDialogActionAction';
import setHeroFacingDirectionAction from '../redux/actions/heroData/setHeroFacingDirectionAction';
import setMapKeyAction from '../redux/actions/mapData/setMapKeyAction';
import setHeroInitialPositionAction from '../redux/actions/heroData/setHeroInitialPositionAction';
import setHeroPreviousPositionAction from '../redux/actions/heroData/setHeroPreviousPositionAction';
import setHeroInitialFrameAction from '../redux/actions/heroData/setHeroInitialFrameAction';

export const getSelectorData = (selector) => {
    const { getState } = store;

    return selector(getState());
};

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
    });

    // eslint-disable-next-line no-param-reassign
    scene.map = map;
};

export const handleCreateHero = (scene) => {
    const initialFrame = getSelectorData(selectHeroInitialFrame);

    // Create hero sprite
    const heroSprite = scene.physics.add
        .sprite(0, 0, HERO_SPRITE_NAME, initialFrame)
        .setName(HERO_SPRITE_NAME)
        .setOrigin(0, 0)
        .setDepth(1);

    const actionColliderSizeOffset = 2;
    // eslint-disable-next-line no-param-reassign
    heroSprite.actionCollider = createInteractiveGameObject(
        scene,
        0,
        0,
        TILE_WIDTH - actionColliderSizeOffset,
        TILE_HEIGHT - actionColliderSizeOffset
    );

    const updateActionCollider = (
        { top, right, bottom, left } = heroSprite.body
    ) => {
        const facingDirection = scene.gridEngine.getFacingDirection(HERO_SPRITE_NAME);

        switch (facingDirection) {
            case DOWN_DIRECTION: {
                heroSprite.actionCollider.setX(left + (actionColliderSizeOffset / 2));
                heroSprite.actionCollider.setY(bottom);

                break;
            }

            case UP_DIRECTION: {
                heroSprite.actionCollider.setX(left + (actionColliderSizeOffset / 2));
                heroSprite.actionCollider.setY(top - heroSprite.body.height + actionColliderSizeOffset);

                break;
            }

            case LEFT_DIRECTION: {
                heroSprite.actionCollider.setX(left - heroSprite.body.width + actionColliderSizeOffset);
                heroSprite.actionCollider.setY(top + (actionColliderSizeOffset / 2));

                break;
            }

            case RIGHT_DIRECTION: {
                heroSprite.actionCollider.setX(right);
                heroSprite.actionCollider.setY(top + (actionColliderSizeOffset / 2));

                break;
            }

            default: {
                break;
            }
        }
    };

    heroSprite.update = (time, delta) => {
        updateActionCollider();
    };

    // eslint-disable-next-line no-param-reassign
    scene.heroSprite = heroSprite;
    scene.sprites.add(heroSprite);
};

export const handleObjectsLayer = (scene) => {
    // Load game objects like items, enemies, etc
    const dispatch = getDispatch();
    scene.map.objects.forEach((objectLayerData, layerIndex) => {
        objectLayerData?.objects?.forEach((object, objectIndex) => {
            const { gid, properties, x, y } = object;
            const propertiesObject = Object.fromEntries(
                properties?.map((curr) => [curr.name, curr.value]) || []
            );

            switch (gid) {
                case ENEMY: {
                    const name = `${ENEMY_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const enemy = scene.physics.add
                        .sprite(x, y, ENEMY_SPRITE_NAME, IDLE_FRAME.replace('position', DOWN_DIRECTION))
                        .setName(name)
                        .setOrigin(0, 1)
                        .setDepth(1);

                    scene.sprites.add(enemy);
                    scene.enemies.add(enemy);
                    scene.gridEngine.addCharacter({
                        id: name,
                        offsetY: 0, // default
                        sprite: enemy,
                        startPosition: {
                            x: Math.floor(x / TILE_WIDTH),
                            y: Math.floor(y / TILE_HEIGHT) - 1,
                        },
                    });

                    const enemyActionHeroCollider = scene.physics.add.overlap(
                        enemy,
                        scene.heroSprite.actionCollider,
                        (e, a) => {
                            if (Input.Keyboard.JustDown(scene.actionKey)) {
                                const messages = getSelectorData(selectDialogMessages);

                                if (messages.length === 0) {
                                    enemyActionHeroCollider.active = false;
                                    dispatch(setDialogCharacterNameAction('monster'));
                                    dispatch(setDialogMessagesAction([
                                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                                        'Praesent id neque sodales, feugiat tortor non, fringilla ex.',
                                        'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur',
                                    ]));
                                    dispatch(setDialogActionAction(() => {
                                        // Do this to not trigger the message again
                                        // Because whenever you call JustDown once, the second time
                                        // you call it, it will be false
                                        Input.Keyboard.JustDown(scene.actionKey);
                                        dispatch(setDialogCharacterNameAction(''));
                                        dispatch(setDialogMessagesAction([]));
                                        dispatch(setDialogActionAction(null));
                                    }));

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
                    const name = `${COIN_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const coin = scene.physics.add
                        .sprite(x, y, COIN_SPRITE_NAME, 'coin_idle_01')
                        .setOrigin(0, 1)
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

                    break;
                }

                case HEART: {
                    const name = `${HEART_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const heart = scene.physics.add
                        .image(x, y, HEART_SPRITE_NAME)
                        .setOrigin(0, 1)
                        .setName(name)
                        .setDepth(1);

                    scene.items.add(heart);

                    break;
                }

                case CRYSTAL: {
                    const name = `${CRYSTAL_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const crystal = scene.physics.add
                        .image(x, y, CRYSTAL_SPRITE_NAME)
                        .setOrigin(0, 1)
                        .setName(name)
                        .setDepth(1);

                    scene.items.add(crystal);

                    break;
                }

                case KEY: {
                    const name = `${KEY_SPRITE_NAME}_${layerIndex}${objectIndex}`;
                    const key = scene.physics.add
                        .image(x, y, KEY_SPRITE_NAME)
                        .setOrigin(0, 1)
                        .setName(name)
                        .setDepth(1);

                    scene.items.add(key);

                    break;
                }

                case DOOR: {
                    const { type, map, position } = propertiesObject;
                    const customCollider = createInteractiveGameObject(
                        scene,
                        x,
                        y,
                        TILE_WIDTH,
                        TILE_HEIGHT,
                        { x: 0, y: 1 }
                    );

                    const overlapCollider = scene.physics.add.overlap(scene.heroSprite, customCollider, () => {
                        scene.physics.world.removeCollider(overlapCollider);
                        const [posX, posY] = position.split(';').map((n) => Number.parseInt(n, 10));
                        const facingDirection = scene.gridEngine.getFacingDirection(HERO_SPRITE_NAME);

                        Promise.all([
                            dispatch(setMapKeyAction(map)),
                            dispatch(setHeroFacingDirectionAction(facingDirection)),
                            dispatch(setHeroInitialPositionAction({ x: posX, y: posY })),
                            dispatch(setHeroPreviousPositionAction({ x: posX, y: posY })),
                            dispatch(setHeroInitialFrameAction(
                                IDLE_FRAME.replace('position', facingDirection)
                            )),
                        ]).then(() => {
                            // scene.scene.restart();
                            changeScene(scene, 'GameScene', {
                                atlases: ['hero'],
                                images: [],
                                mapKey: map,
                            });
                        });
                    });

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
        camera.setPosition(
            (game.scale.gameSize.width - scene.map.widthInPixels) / 2
        );
    }

    if (scene.map.heightInPixels < game.scale.gameSize.height) {
        camera.setPosition(
            camera.x,
            (game.scale.gameSize.height - scene.map.heightInPixels) / 2
        );
    }
};

export const handleCreateHeroAnimations = (scene) => {
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

export const handleConfigureGridEngine = (scene) => {
    const initialPosition = getSelectorData(selectHeroInitialPosition);
    const facingDirection = getSelectorData(selectHeroFacingDirection);

    // Grid Engine
    scene.gridEngine.create(scene.map, {
        // characterCollisionStrategy: 'BLOCK_TWO_TILES', // default
        // collisionTilePropertyName: 'ge_collide', // default
        // numberOfDirections: 4, // default
        characters: [{
            id: HERO_SPRITE_NAME,
            // offsetY: 0, // default
            sprite: scene.heroSprite,
            startPosition: initialPosition,
            facingDirection,
        }],
    });
};

export const handleHeroMovement = (scene) => {
    if (scene.cursors.left.isDown || scene.wasd[LEFT_DIRECTION].isDown) {
        scene.gridEngine.move(HERO_SPRITE_NAME, LEFT_DIRECTION);
    } else if (scene.cursors.right.isDown || scene.wasd[RIGHT_DIRECTION].isDown) {
        scene.gridEngine.move(HERO_SPRITE_NAME, RIGHT_DIRECTION);
    } else if (scene.cursors.up.isDown || scene.wasd[UP_DIRECTION].isDown) {
        scene.gridEngine.move(HERO_SPRITE_NAME, UP_DIRECTION);
    } else if (scene.cursors.down.isDown || scene.wasd[DOWN_DIRECTION].isDown) {
        scene.gridEngine.move(HERO_SPRITE_NAME, DOWN_DIRECTION);
    }
};

export const changeScene = (scene, nextScene, assets = {}, config = {}) => {
    // const sceneKey = scene.scene.key;
    // scene.scene.restart(sceneKey);
    // scene.scene.stop(sceneKey);

    scene.scene.start('LoadAssetsScene', {
        nextScene,
        assets,
    });
};
