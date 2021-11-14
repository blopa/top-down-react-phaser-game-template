import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Phaser from 'phaser';
import GridEngine from 'grid-engine';

// Styles
import './Game.css';

// Actions
import { simpleAction } from './redux/actions/simpleAction';
import { calculateGameSize, isObjectNotEmpty } from './utils';

// Game Scenes
import TestScene from './game/scenes/TestScene';

// Constants
import {
    MIN_GAME_HEIGHT,
    MIN_GAME_WIDTH,
    RESIZE_THRESHOLD,
    TILE_HEIGHT,
    TILE_WIDTH,
} from './constants';

function Game() {
    const [game, setGame] = useState(null);
    const number = useSelector((state) => state.simple.number);
    const dispatch = useDispatch();
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
        <div className="App">
            <div
                id="game-content"
                key="game-content"
            >
                {/* this is where the game canvas will be rendered */}
            </div>
            {number}
            <button
                type="button"
                onClick={() => dispatch(simpleAction())}
            >
                Click!
            </button>
        </div>
    );
}

export default Game;
