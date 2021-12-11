// import io from 'socket.io-client';
import { Scene } from 'phaser';

// Utils
import {
    handleCreateMap,
    handleCreateHero,
    handleObjectsLayer,
    handleHeroMovement,
    handleCreateGroups,
    handleConfigureCamera,
    handleCreateControlKeys,
    handleConfigureGridEngine,
    handleHeroOverlapWithItems,
    handleCreateHeroAnimations,
    handleCreateEnemiesAnimations,
    handleCreateHeroPushTileAction,
    handleCreateHeroEnemiesOverlap,
    handleCreateCharactersMovements, connectToServer,
} from '../../utils/sceneHelpers';
import { getSelectorData } from '../../utils/utils';

// Constants
import {
    LAST_TIME_CONNECTED_DATA_KEY,
    LAST_TIME_CONNECTED_THRESHOLD,
} from '../../utils/constants';

// Selectors
import { selectMyPlayerId } from '../../redux/selectors/selectPlayers';
import { selectGameCurrentRoomId } from '../../redux/selectors/selectGameManager';
import { MOVE_CHARACTER } from '../../server/constants';

export default class GameScene extends Scene {
    constructor() {
        super('GameScene');
    }

    otherPlayers = [];

    create() {
        // All of these functions need to be called in order

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

        // Load game objects like items, enemies, etc
        handleObjectsLayer(this);

        // Handle create item colecting
        handleHeroOverlapWithItems(this);

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
        const socket = connectToServer();
        socket.on(MOVE_CHARACTER, (stringfiedData) => {
            const data = JSON.parse(stringfiedData);
            this.gridEngine.move(data.playerId, data.direction);
        });
    }

    update(time, delta) {
        handleHeroMovement(this);
        this.heroSprite.update(time, delta);
    }
}
