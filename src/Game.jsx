import Phaser from 'phaser';
import { useCallback, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import isMobile from 'is-mobile';

// Utils
import { calculateGameSize, getScenesModules } from './utils/phaser';
import { isDev } from './utils/utils';

// Components
import VirtualGamepad from './components/VirtualGamepad/VirtualGamepad';
import ReactWrapper from './components/ReactWrapper';

// Selectors
import {
    selectGameZoom,
    selectGameWidth,
    selectGameHeight,
    selectGameLocale,
    selectGameSetters,
    selectGameCameraSizeUpdateCallbacks,
} from './zustand/game/selectGameData';

// Store
import { useGameStore } from './zustand/store';

// Constants
import {
    TILE_WIDTH,
    TILE_HEIGHT,
    DEFAULT_LOCALE,
    MIN_GAME_WIDTH,
    GAME_CONTENT_ID,
    MIN_GAME_HEIGHT,
    RESIZE_THRESHOLD,
    RE_RESIZE_THRESHOLD,
} from './constants';
import defaultMessages from './intl/en.json';

const IS_DEV = isDev();

function Game() {
    const [game, setGame] = useState(null);
    const locale = useGameStore(selectGameLocale) || DEFAULT_LOCALE;
    const cameraSizeUpdateCallbacks = useGameStore(selectGameCameraSizeUpdateCallbacks);
    const [messages, setMessages] = useState(defaultMessages);
    const {
        setGameZoom,
        setGameWidth,
        setGameHeight,
        setGameCanvasElement,
    } = useGameStore(selectGameSetters);

    // Game
    const gameWidth = useGameStore(selectGameWidth);
    const gameHeight = useGameStore(selectGameHeight);
    const gameZoom = useGameStore(selectGameZoom);

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

        if (locale !== DEFAULT_LOCALE) {
            loadMessages();
        }
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
            scene: getScenesModules(),
            physics: {
                default: 'arcade',
                arcade: {
                    debug: IS_DEV,
                },
            },
            backgroundColor: '#000000',
        });

        updateGameGlobalState(width, height, zoom);
        setGame(phaserGame);

        if (IS_DEV) {
            window.phaserGame = phaserGame;
        }
    }, [
        game,
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
        const resizeDoneCallback = () => {
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
                cameraSizeUpdateCallbacks.forEach((cameraSizeUpdateCallback) => {
                    cameraSizeUpdateCallback?.();
                });
            };

            scaleGame();

            // re-run function after resize is done to re-trigger css calculations
            setTimeout(scaleGame, RE_RESIZE_THRESHOLD);
        };

        const canvasResizeCallback = () => {
            clearTimeout(timeOutFunctionId);
            timeOutFunctionId = setTimeout(resizeDoneCallback, RESIZE_THRESHOLD);
        };

        // TODO move to the ResizeObserver https://jsfiddle.net/rudiedirkx/p0ckdcnv/
        window.addEventListener('resize', canvasResizeCallback);

        return () => {
            window.removeEventListener('resize', canvasResizeCallback);
        };
    }, [
        game,
        updateGameGlobalState,
        cameraSizeUpdateCallbacks,
    ]);

    return (
        <IntlProvider
            messages={messages}
            locale={locale}
            defaultLocale={DEFAULT_LOCALE}
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
