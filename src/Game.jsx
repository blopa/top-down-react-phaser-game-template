import { useCallback, useEffect, useState } from 'react';
import Phaser from 'phaser';
import GridEngine from 'grid-engine';
import { useDispatch } from 'react-redux';

// Utils
import { calculateGameSize } from './utils/utils';

// Constants
import {
    RESIZE_THRESHOLD,
    MIN_GAME_HEIGHT,
    MIN_GAME_WIDTH,
    TILE_HEIGHT,
    TILE_WIDTH,
} from './constants';

// Game Scenes
import GameScene from './game/scenes/GameScene';
import BootScene from './game/scenes/BootScene';
import LoadAssetsScene from './game/scenes/LoadAssetsScene';

// Actions
import setGameHeightAction from './redux/actions/setGameHeightAction';
import setGameWidthAction from './redux/actions/setGameWidthAction';
import setGameZoomAction from './redux/actions/setGameZoomAction';

function Game() {
    const dispatch = useDispatch();
    const [game, setGame] = useState(null);
    const { width, height, zoom } = calculateGameSize(
        MIN_GAME_WIDTH,
        MIN_GAME_HEIGHT,
        TILE_WIDTH,
        TILE_HEIGHT
    );

    const updateGameReduxState = useCallback((
        gameHeight,
        gameWidth,
        gameZoom
    ) => {
        dispatch(setGameHeightAction(gameHeight));
        dispatch(setGameWidthAction(gameWidth));
        dispatch(setGameZoomAction(gameZoom));
    }, [dispatch]);

    // Create the game inside a useEffect
    // to create it only once
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
                GameScene,
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

        updateGameReduxState(width, height, zoom);

        // Create listener to resize the game
        // when the window is resized
        let timeOutFunctionId;
        const workAfterResizeIsDone = () => {
            const gameSize = calculateGameSize(
                MIN_GAME_WIDTH,
                MIN_GAME_HEIGHT,
                TILE_WIDTH,
                TILE_HEIGHT
            );

            updateGameReduxState(gameSize.width, gameSize.height, gameSize.zoom);
            phaserGame.scale.resize(gameSize.width, gameSize.height);
            phaserGame.scale.setZoom(gameSize.zoom);
        };

        window.addEventListener('resize', () => {
            clearTimeout(timeOutFunctionId);
            timeOutFunctionId = setTimeout(workAfterResizeIsDone, RESIZE_THRESHOLD);
        });

        setGame(phaserGame);
        // window.phaserGame = game;
    }, [
        game,
        width,
        height,
        zoom,
        updateGameReduxState,
    ]);

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
