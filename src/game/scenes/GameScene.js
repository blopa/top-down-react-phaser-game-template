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
import { getSelectorData } from '../../utils/utils';

// Selectors
import { selectGameSetters } from '../../zustand/game/selectGameData';

export const key = 'GameScene';

export const scene = {};

export function create() {
    // scene.input.on('pointerup', (pointer) => {
    //     console.log('clicky click');
    // });
    const { addGameCameraSizeUpdateCallback } = getSelectorData(selectGameSetters);

    // All of these functions need to be called in order

    // Create controls
    handleCreateControls(scene);

    // Create game groups
    handleCreateGroups(scene);

    // Create the map
    const customColliders = handleCreateMap(scene);

    // Create hero sprite
    handleCreateHero(scene);

    // Load game objects like items, enemies, etc
    handleObjectsLayer(scene);

    // Configure the main camera
    handleConfigureCamera(scene);
    addGameCameraSizeUpdateCallback(() => {
        handleConfigureCamera(scene);
    });

    // Hero animations
    handleCreateHeroAnimations(scene);

    // Handle collisions
    scene.physics.add.collider(scene.heroSprite, scene.enemies);
    scene.physics.add.collider(scene.heroSprite, customColliders);
}

export function update(time, delta) {
    handleHeroMovement(scene);
    scene.heroSprite.update(time, delta);
}
