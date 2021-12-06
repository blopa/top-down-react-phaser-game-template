import { Scene } from 'phaser';
import io from 'socket.io-client';
import {
    ADD_CHARACTER,
    NEW_GAME,
    MOVE_HERO_SERVER,
} from '../../serverConstants';

// Utils
import {
    handleCreateMap,
    handleCreateHero,
    handleObjectsLayer,
    handleHeroMovement,
    handleCreateGroups,
    handleCreateControlKeys,
    handleConfigureCamera,
    handleConfigureGridEngine,
    handleCreateHeroAnimations,
    handleCreateCharactersMovements,
} from '../../utils/sceneHelpers';

export default class GameScene extends Scene {
    constructor() {
        super('GameScene');
    }

    otherPlayers = [];

    create() {
        const socket = io('http://localhost:4000');

        socket.on(MOVE_HERO_SERVER, (hero, direction) => {
            if (this.heroSprite.name !== hero) {
                this.gridEngine.move(hero, direction);
            }
        });

        socket.on(ADD_CHARACTER, (hero) => {
            console.log(hero);
            if (this.heroSprite.name !== hero) {
                const heroSprite = this.physics.add
                    .sprite(0, 0, 'hero')
                    .setName(hero)
                    .setDepth(1);

                this.gridEngine.addCharacter({
                    id: hero,
                    offsetY: 0,
                    sprite: heroSprite,
                    startPosition: {
                        x: 30,
                        y: 40,
                    },
                });

                this.otherPlayers.push(hero);
            }
        });

        // All of these functions need to be called in order

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

        // Configure the main camera
        handleConfigureCamera(this);

        // Animations
        handleCreateHeroAnimations(this);

        // Handle characters movements
        handleCreateCharactersMovements(this);
        socket.emit(NEW_GAME, this.heroSprite.name);
        this.socket = socket;
    }

    update(time, delta) {
        handleHeroMovement(this);
        this.heroSprite.update(time, delta);
    }
}
