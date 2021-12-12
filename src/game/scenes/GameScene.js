// import io from 'socket.io-client';
import { Scene } from 'phaser';

// Utils
import {
    handlePushTile,
    connectToServer,
    handleCreateMap,
    handleCreateHero,
    handleCreateRivals,
    handleObjectsLayer,
    handleHeroMovement,
    handleCreateGroups,
    handleItemCollected,
    handleConfigureCamera,
    handleCreateControlKeys,
    handleConfigureGridEngine,
    handleCreateHeroAnimations,
    handleCreateEnemiesAnimations,
    handlePlayersOverlapWithItems,
    handleCreateHeroPushTileAction,
    handleCreateHeroEnemiesOverlap,
    handleCreateCharactersMovements,
} from '../../utils/sceneHelpers';
import { getSelectorData } from '../../utils/utils';

// Constants
import {
    LAST_TIME_CONNECTED_DATA_KEY,
    LAST_TIME_CONNECTED_THRESHOLD,
} from '../../utils/constants';
import {
    RESPOND_TILE_PUSHED,
    RESPOND_ITEM_COLLECTED,
    RESPOND_MOVE_CHARACTER,
} from '../../server/constants';

// Selectors
import { selectMyPlayerId } from '../../redux/selectors/selectPlayers';
import { selectGameCurrentRoomId } from '../../redux/selectors/selectGameManager';

export default class GameScene extends Scene {
    constructor() {
        super('GameScene');
    }

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
        const socket = connectToServer();
        socket.on(RESPOND_MOVE_CHARACTER, (stringfiedData) => {
            const data = JSON.parse(stringfiedData);
            this.gridEngine.moveTo(data.playerId, data.position);
        });

        socket.on(RESPOND_TILE_PUSHED, (stringfiedData) => {
            const tileData = JSON.parse(stringfiedData);
            handlePushTile(this, tileData);
        });

        socket.on(RESPOND_ITEM_COLLECTED, (stringfiedData) => {
            const itemData = JSON.parse(stringfiedData);
            handleItemCollected(this, itemData);
        });
    }

    update(time, delta) {
        handleHeroMovement(this);
        this.heroSprite.update(time, delta);
        if (this.items.getChildren().length === 0) {
            console.log('Game Over');
        }
    }
}
