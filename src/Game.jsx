import { useEffect, useState } from 'react';
import Phaser from 'phaser';
import GridEngine from 'grid-engine';

// Utils
import { calculateGameSize } from './utils';

// Constants
import {
    MIN_GAME_HEIGHT,
    MIN_GAME_WIDTH,
    RESIZE_THRESHOLD,
    TILE_HEIGHT,
    TILE_WIDTH,
} from './constants';

// Game Scenes
import TestScene from './game/scenes/TestScene';
import BootScene from './game/scenes/BootScene';
import LoadAssetsScene from './game/scenes/LoadAssetsScene';

function Game() {
    const [game, setGame] = useState(null);
    const { width, height, zoom } = calculateGameSize(
        MIN_GAME_WIDTH,
        MIN_GAME_HEIGHT,
        TILE_WIDTH,
        TILE_HEIGHT
    );

    useEffect(() => {
        if (game) {
            return;
        }

        const phaserGame = new Phaser.Game({
            type: Phaser.AUTO,
            title: 'some-game-title',
            parent: 'game-content',
            orientation: Phaser.Scale.LANDSCAPE,
            localStorageName: 'some-game-title',
            width,
            height,
            zoom,
            autoRound: true,
            pixelArt: true,
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.NONE,
            },
            scene: [
                BootScene,
                LoadAssetsScene,
                TestScene,
            ],
            physics: {
                default: 'arcade',
            },
            plugins: {
                scene: [
                    {
                        key: 'gridEngine',
                        plugin: GridEngine,
                        mapping: 'gridEngine',
                    },
                ],
            },
            backgroundColor: '#FF0000',
        });

        let timeOutFunctionId;
        const workAfterResizeIsDone = () => {
            const gameSize = calculateGameSize(
                MIN_GAME_WIDTH,
                MIN_GAME_HEIGHT,
                TILE_WIDTH,
                TILE_HEIGHT
            );

            phaserGame.scale.resize(gameSize.width, gameSize.height);
            phaserGame.scale.setZoom(gameSize.zoom);
        };

        window.addEventListener('resize', () => {
            clearTimeout(timeOutFunctionId);
            timeOutFunctionId = setTimeout(workAfterResizeIsDone, RESIZE_THRESHOLD);
        });

        setGame(phaserGame);
        // window.phaserGame = game;
    }, [game, width, height, zoom]);

    return (
        <div>
            <div
                id="game-content"
                key="game-content"
            >
                {/* this is where the game canvas will be rendered */}
            </div>
        </div>
    );
}

export default Game;
