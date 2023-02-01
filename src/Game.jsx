import Phaser from 'phaser';
import { useCallback, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import isMobile from 'is-mobile';

// Utils
import { calculateGameSize } from './utils/phaser';
import { isDev } from './utils/utils';

// Constants
import {
    TILE_WIDTH,
    TILE_HEIGHT,
    MIN_GAME_WIDTH,
    GAME_CONTENT_ID,
    MIN_GAME_HEIGHT,
    RESIZE_THRESHOLD,
    RE_RESIZE_THRESHOLD,
} from './constants';

// Components
import VirtualGamepad from './components/VirtualGamepad/VirtualGamepad';
import ReactWrapper from './components/ReactWrapper';

// Selectors
import {
    selectGameZoom,
    selectGameWidth,
    selectGameHeight,
    selectGameLocale,
    selectGameCameraSizeUpdateCallback,
} from './zustand/selectors/selectGameData';

// Store
import { useStore } from './zustand/store';

// Game Scenes
import BootScene from './game/scenes/BootScene';

// automatically import all scenes from the scenes folder
const contextResolver = require.context('./game/scenes/', true, /\.js$/);
const scenes = contextResolver.keys().map((element) => contextResolver(element));

function Game() {
    const defaultLocale = 'en';
    const isDevelopment = isDev();

    const [game, setGame] = useState(null);
    const locale = useStore(selectGameLocale) || defaultLocale;
    const cameraSizeUpdateCallback = useStore(selectGameCameraSizeUpdateCallback);
    const [messages, setMessages] = useState({});
    const setGameCanvasElement = useStore((state) => state.setGameCanvasElement);
    const setGameHeight = useStore((state) => state.setGameHeight);
    const setGameWidth = useStore((state) => state.setGameWidth);
    const setGameZoom = useStore((state) => state.setGameZoom);

    // Game
    const gameWidth = useStore(selectGameWidth);
    const gameHeight = useStore(selectGameHeight);
    const gameZoom = useStore(selectGameZoom);

    useEffect(() => {
        document.documentElement.style.setProperty('--game-zoom', gameZoom);
        document.documentElement.style.setProperty('--game-height', gameHeight);
        document.documentElement.style.setProperty('--game-width', gameWidth);
    }, [gameHeight, gameWidth, gameZoom]);

    useEffect(() => {
        async function loadMessages() {
            const module = await import(`./intl/${locale}.json`);
            setMessages(module.default);
        }

        loadMessages();
    }, [locale]);

    const updateGameGlobalState = useCallback((
        gameWidth,
        gameHeight,
        gameZoom
    ) => {
        setGameHeight(gameHeight);
        setGameWidth(gameWidth);
        setGameZoom(gameZoom);
    }, [setGameHeight, setGameWidth, setGameZoom]);

    // Create the game inside a useEffect
    // to create it only once
    useEffect(() => {
        // do this otherwise development hot-reload
        // will create a bunch of Phaser instances
        if (game) {
            return;
        }

        const { width, height, zoom } = calculateGameSize(
            MIN_GAME_WIDTH,
            MIN_GAME_HEIGHT,
            TILE_WIDTH,
            TILE_HEIGHT
        );

        const phaserGame = new Phaser.Game({
            type: Phaser.AUTO,
            title: 'some-game-title',
            parent: GAME_CONTENT_ID,
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
                ...scenes.map((module) => module.default)
                    .filter((scene) => scene.name !== 'BootScene'),
            ],
            physics: {
                default: 'arcade',
                arcade: {
                    debug: isDevelopment,
                },
            },
            backgroundColor: '#000000',
        });

        updateGameGlobalState(width, height, zoom);
        setGame(phaserGame);

        if (isDevelopment) {
            window.phaserGame = phaserGame;
        }
    }, [
        game,
        isDevelopment,
        updateGameGlobalState,
    ]);

    useEffect(() => {
        if (game?.canvas) {
            setGameCanvasElement(game.canvas);
        }
    }, [setGameCanvasElement, game?.canvas]);

    useEffect(() => {
        if (!game) {
            return () => {};
        }

        // Create listener to resize the game
        // when the window is resized
        let timeOutFunctionId;
        const workAfterResizeIsDone = () => {
            const scaleGame = () => {
                const gameSize = calculateGameSize(
                    MIN_GAME_WIDTH,
                    MIN_GAME_HEIGHT,
                    TILE_WIDTH,
                    TILE_HEIGHT
                );

                // console.log(JSON.stringify(gameSize));
                game.scale.setZoom(gameSize.zoom);
                game.scale.resize(gameSize.width, gameSize.height);
                // game.scale.setGameSize(gameSize.width, gameSize.height);
                // game.scale.displaySize.resize(gameSize.width, gameSize.height);
                // game.scale.resize(gameSize.width, gameSize.height).getParentBounds();
                updateGameGlobalState(gameSize.width, gameSize.height, gameSize.zoom);
                // game.canvas.style.width = `${gameSize.width}px`;
                // game.canvas.style.height = `${gameSize.height}px`;
                cameraSizeUpdateCallback?.();
            };

            scaleGame();

            // re-run function after resize is done to re-trigger css calculations
            setTimeout(scaleGame, RE_RESIZE_THRESHOLD);
        };

        const canvasResizeCallback = () => {
            clearTimeout(timeOutFunctionId);
            timeOutFunctionId = setTimeout(workAfterResizeIsDone, RESIZE_THRESHOLD);
        };

        // TODO move to the ResizeObserver https://jsfiddle.net/rudiedirkx/p0ckdcnv/
        window.addEventListener('resize', canvasResizeCallback);

        return () => {
            window.removeEventListener('resize', canvasResizeCallback);
        };
    }, [
        game,
        updateGameGlobalState,
        cameraSizeUpdateCallback,
    ]);

    return (
        <IntlProvider
            messages={messages}
            locale={locale}
            defaultLocale={defaultLocale}
        >
            <div
                id={GAME_CONTENT_ID}
                key={GAME_CONTENT_ID}
            >
                {/* this is where the game canvas will be rendered */}
            </div>
            <ReactWrapper />
            {isMobile() && (
                <VirtualGamepad />
            )}
        </IntlProvider>
    );
}

export default Game;
