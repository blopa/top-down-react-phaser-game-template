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

// Store
import store from '../../zustand/store';

export const key = 'GameScene';

export function create() {
    // this.input.on('pointerup', (pointer) => {
    //     console.log('clicky click');
    // });
    const { setGameCameraSizeUpdateCallback } = store.getState();

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
    setGameCameraSizeUpdateCallback(() => {
        handleConfigureCamera(this);
    });

    // Hero animations
    handleCreateHeroAnimations(this);

    // Handle collisions
    this.physics.add.collider(this.heroSprite, this.enemies);
    this.physics.add.collider(this.heroSprite, customColliders);
}

export function update(time, delta) {
    handleHeroMovement(this);
    this.heroSprite.update(time, delta);
}
