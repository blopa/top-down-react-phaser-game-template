import { Scene, Input } from 'phaser';

// Constants
import {
    UP_DIRECTION,
    DOWN_DIRECTION,
    LEFT_DIRECTION,
    RIGHT_DIRECTION,
    HERO_SPRITE_NAME,
} from '../../constants';

// Utils
import {
    handleCreateMap,
    handleCreateHero,
    handleAnimations,
    handleObjectsLayer,
    handleConfigureCamera,
    handleCharactersMovements,
} from '../../utils/sceneHelpers';

// Store
import store from '../../redux/store';

// Selectors
import { selectMapKey, selectTilesets } from '../../redux/selectors/selectMapData';
import {
    selectHeroInitialFrame,
    selectHeroFacingDirection,
    selectHeroInitialPosition,
} from '../../redux/selectors/selectHeroData';

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
        this.actionKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            [UP_DIRECTION]: Input.Keyboard.KeyCodes.W,
            [DOWN_DIRECTION]: Input.Keyboard.KeyCodes.S,
            [LEFT_DIRECTION]: Input.Keyboard.KeyCodes.A,
            [RIGHT_DIRECTION]: Input.Keyboard.KeyCodes.D,
        });

        // Game groups
        this.sprites = this.add.group();
        this.enemies = this.add.group();
        this.items = this.add.group();

        const map = handleCreateMap(
            this,
            mapKey,
            tilesets
        );

        this.heroSprite = handleCreateHero(
            this,
            initialFrame
        );
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

        handleObjectsLayer(
            this,
            map.objects,
            this.heroSprite,
            this.sprites,
            this.enemies,
            this.items
        );

        handleConfigureCamera(
            this.heroSprite,
            camera,
            map,
            game
        );

        handleAnimations(this);

        handleCharactersMovements(
            this.gridEngine,
            this.sprites
        );
    }

    update(time, delta) {
        if (this.cursors.left.isDown || this.wasd[LEFT_DIRECTION].isDown) {
            this.gridEngine.move(HERO_SPRITE_NAME, LEFT_DIRECTION);
        } else if (this.cursors.right.isDown || this.wasd[RIGHT_DIRECTION].isDown) {
            this.gridEngine.move(HERO_SPRITE_NAME, RIGHT_DIRECTION);
        } else if (this.cursors.up.isDown || this.wasd[UP_DIRECTION].isDown) {
            this.gridEngine.move(HERO_SPRITE_NAME, UP_DIRECTION);
        } else if (this.cursors.down.isDown || this.wasd[DOWN_DIRECTION].isDown) {
            this.gridEngine.move(HERO_SPRITE_NAME, DOWN_DIRECTION);
        }

        this.heroSprite.update(time, delta);
    }
}
