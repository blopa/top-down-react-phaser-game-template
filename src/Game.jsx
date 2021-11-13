import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Phaser from 'phaser';
import GridEngine from 'grid-engine';

// Styles
import './Game.css';

// Actions
import { simpleAction } from './redux/actions/simpleAction';

function Game() {
    const number = useSelector((state) => state.simple.number);
    const dispatch = useDispatch();

    useEffect(() => {
        const game = new Phaser.Game({
            type: Phaser.AUTO,
            title: 'some-game-title',
            parent: 'game-content',
            orientation: Phaser.Scale.LANDSCAPE,
            localStorageName: 'some-game-title',
            // width,
            // height,
            autoRound: true,
            pixelArt: true,
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.ENVELOP,
            },
            scene: [],
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
            backgroundColor: '#000000',
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
