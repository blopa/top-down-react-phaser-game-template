// import io from 'socket.io-client';
import { Scene } from 'phaser';

// Utils
import {
    handleCreateMap,
    handleCreateHero,
    handleCreateRivals,
    handleObjectsLayer,
    handleHeroMovement,
    handleCreateGroups,
    handleGameplayActions,
    handleConfigureCamera,
    handleCreateControlKeys,
    handleConfigureGridEngine,
    handleCreateHeroAnimations,
    handleCreateEnemiesAnimations,
    handlePlayersOverlapWithItems,
    handleCreateHeroPushTileAction,
    handleCreateHeroEnemiesOverlap,
    handleCreateCharactersMovements,
    handleLastTimeConnectedCheckpoint,
} from '../../utils/sceneHelpers';

export default class GameScene extends Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // All of these functions need to be called in order

        handleLastTimeConnectedCheckpoint(this);

        // Create controls
        handleCreateControlKeys(this);

        // Create game groups
        handleCreateGroups(this);

        // Create the map
        handleCreateMap(this);

        // Create hero sprite
        handleCreateHero(this);

        // Configure grid engine
        handleConfigureGridEngine(this);

        // Create rivals sprite
        handleCreateRivals(this);

        // Load game objects like items, enemies, etc
        handleObjectsLayer(this);

        // Handle create item colecting
        handlePlayersOverlapWithItems(this);

        // Configure the main camera
        handleConfigureCamera(this);

        // Hero animations
        handleCreateHeroAnimations(this);

        // Enemies animations
        handleCreateEnemiesAnimations(this);

        // Handle characters movements
        handleCreateCharactersMovements(this);

        // Handle create hero action to push tiles
        handleCreateHeroPushTileAction(this);

        // Handle create hero action to push tiles
        handleCreateHeroEnemiesOverlap(this);

        // Handle character movements from server
        handleGameplayActions(this);
    }

    update(time, delta) {
        handleHeroMovement(this);
        this.heroSprite.update(time, delta);
        if (this.items.getChildren().length === 0) {
            console.log('Game Over');
        }
    }
}
