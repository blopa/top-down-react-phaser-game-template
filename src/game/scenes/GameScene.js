import { Scene } from 'phaser';

// Utils
import {
    handleCreateMap,
    handleCreateHero,
    handleObjectsLayer,
    handleHeroMovement,
    handleCreateGroups,
    handleCreateControls,
    handleConfigureCamera,
    handleCreateHeroAnimations,
} from '../../utils/sceneHelpers';
import { getDispatch } from '../../utils/utils';
import setGameCameraSizeUpdateCallbackAction from '../../redux/actions/game/setGameCameraSizeUpdateCallbackAction';

export default class GameScene extends Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // this.input.on('pointerup', (pointer) => {
        //     console.log('clicky click');
        // });
        const dispatch = getDispatch();

        // All of these functions need to be called in order

        // Create controls
        handleCreateControls(this);

        // Create game groups
        handleCreateGroups(this);

        // Create the map
        const customColliders = handleCreateMap(this);

        // Create hero sprite
        handleCreateHero(this);

        // Load game objects like items, enemies, etc
        handleObjectsLayer(this);

        // Configure the main camera
        handleConfigureCamera(this);
        dispatch(setGameCameraSizeUpdateCallbackAction(() => {
            handleConfigureCamera(this);
        }));

        // Hero animations
        handleCreateHeroAnimations(this);

        // Handle collisions
        this.physics.add.collider(this.heroSprite, this.enemies);
        this.physics.add.collider(this.heroSprite, customColliders);
    }

    update(time, delta) {
        handleHeroMovement(this);
        this.heroSprite.update(time, delta);
    }
}
