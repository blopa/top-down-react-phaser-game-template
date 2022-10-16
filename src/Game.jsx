import Phaser from 'phaser';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IntlProvider } from 'react-intl';
import isMobile from 'is-mobile';

// Utils
import { calculateGameSize } from './utils/phaser';

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

// Game Scenes
import GameScene from './game/scenes/GameScene';
import BootScene from './game/scenes/BootScene';
import LoadAssetsScene from './game/scenes/LoadAssetsScene';
import MainMenuScene from './game/scenes/MainMenuScene';
import BattleScene from './game/scenes/BattleScene';

// Actions
import setGameHeightAction from './redux/actions/game/setGameHeightAction';
import setGameWidthAction from './redux/actions/game/setGameWidthAction';
import setGameZoomAction from './redux/actions/game/setGameZoomAction';
import setGameCanvasElementAction from './redux/actions/game/setGameCanvasElementAction';

// Components
import VirtualGamepad from './components/VirtualGamepad';
import ReactWrapper from './components/ReactWrapper';

// Selectors
import { selectGameCameraSizeUpdateCallback, selectGameLocale } from './redux/selectors/selectGameData';

const Game = () => {
    const defaultLocale = 'en';
    const isDevelopment = process?.env?.NODE_ENV !== 'production';
    const dispatch = useDispatch();
    const [game, setGame] = useState(null);
    const locale = useSelector(selectGameLocale) || defaultLocale;
    const cameraSizeUpdateCallback = useSelector(selectGameCameraSizeUpdateCallback);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        async function loadMessages() {
            const module = await import(`./intl/${locale}.json`);
            setMessages(module.default);
        }

        loadMessages();
    }, [locale]);

    const updateGameReduxState = useCallback(
        (gameWidth, gameHeight, gameZoom) => {
            dispatch(setGameHeightAction(gameHeight));
            dispatch(setGameWidthAction(gameWidth));
            dispatch(setGameZoomAction(gameZoom));
        },
        [dispatch]
    );

    // Create the game inside a useEffect
    // to create it only once
    useEffect(() => {
        // do this otherwise development hot-reload
        // will create a bunch of Phaser instances
        if (game) {
            return;
        }

        const { width, height, zoom } = calculateGameSize(MIN_GAME_WIDTH, MIN_GAME_HEIGHT, TILE_WIDTH, TILE_HEIGHT);

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
            scene: [BootScene, LoadAssetsScene, GameScene, MainMenuScene, BattleScene],
            physics: {
                default: 'arcade',
                arcade: {
                    debug: isDevelopment,
                },
            },
            backgroundColor: '#000000',
        });

        updateGameReduxState(width, height, zoom);
        setGame(phaserGame);

        if (isDevelopment) {
            window.phaserGame = phaserGame;
        }
    }, [game, dispatch, isDevelopment, updateGameReduxState]);

    useEffect(() => {
        if (game?.canvas) {
            dispatch(setGameCanvasElementAction(game.canvas));
        }
    }, [dispatch, game?.canvas]);

    useEffect(() => {
        if (!game) {
            return () => {};
        }

        // Create listener to resize the game
        // when the window is resized
        let timeOutFunctionId;
        const workAfterResizeIsDone = () => {
            const scaleGame = () => {
                const gameSize = calculateGameSize(MIN_GAME_WIDTH, MIN_GAME_HEIGHT, TILE_WIDTH, TILE_HEIGHT);

                // console.log(JSON.stringify(gameSize));
                game.scale.setZoom(gameSize.zoom);
                game.scale.resize(gameSize.width, gameSize.height);
                // game.scale.setGameSize(gameSize.width, gameSize.height);
                // game.scale.displaySize.resize(gameSize.width, gameSize.height);
                // game.scale.resize(gameSize.width, gameSize.height).getParentBounds();
                updateGameReduxState(gameSize.width, gameSize.height, gameSize.zoom);
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
    }, [game, dispatch, updateGameReduxState, cameraSizeUpdateCallback]);

    return (
        <IntlProvider messages={messages} locale={locale} defaultLocale={defaultLocale}>
            <div id={GAME_CONTENT_ID} key={GAME_CONTENT_ID}>
                {/* this is where the game canvas will be rendered */}
            </div>
            <ReactWrapper />
            {isMobile() && <VirtualGamepad />}
        </IntlProvider>
    );
};

export default Game;
