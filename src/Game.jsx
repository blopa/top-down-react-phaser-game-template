import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Phaser from 'phaser';
import GridEngine from 'grid-engine';

// Styles
import './Game.css';

// Actions
import { simpleAction } from './redux/actions/simpleAction';
import { calculateGameSize } from './utils';

// Game Scenes
import TestScene from './game/scenes/TestScene';

function Game() {
    const number = useSelector((state) => state.simple.number);
    const dispatch = useDispatch();

    useEffect(() => {
        const { width, height, zoom } = calculateGameSize(400, 224, 16);
        // console.log(width, height, zoom);
        // console.log(Phaser.Scale.LANDSCAPE, Phaser.Scale.PORTRAIT);

        const game = new Phaser.Game({
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
                mode: Phaser.Scale.ENVELOP,
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
            const { width, height, zoom } = calculateGameSize(400, 224, 16);
            game.scale.resize(width, height);
            game.scale.setZoom(zoom);
            console.log('resized', { width, height, zoom });
        };
        window.addEventListener('resize', () => {
            clearTimeout(timeOutFunctionId);
            timeOutFunctionId = setTimeout(workAfterResizeIsDone, 500);
        });

        // window.phaserGame = game;
    }, []);

    return (
        <div className="App">
            <div
                id="game-content"
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
