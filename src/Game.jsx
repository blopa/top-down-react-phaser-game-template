import Phaser from 'phaser';
import GridEngine from 'grid-engine';
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
    MIN_GAME_HEIGHT,
    RESIZE_THRESHOLD,
} from './constants';

// Game Scenes
import GameScene from './game/scenes/GameScene';
import BootScene from './game/scenes/BootScene';
import LoadAssetsScene from './game/scenes/LoadAssetsScene';
import MainMenuScene from './game/scenes/MainMenuScene';

// Actions
import setGameHeightAction from './redux/actions/game/setGameHeightAction';
import setGameWidthAction from './redux/actions/game/setGameWidthAction';
import setGameZoomAction from './redux/actions/game/setGameZoomAction';
import setGameCanvasElementAction from './redux/actions/game/setGameCanvasElementAction';

// Components
import DialogBox from './components/DialogBox';
import VirtualGamepad from './components/VirtualGamepad';
import GameMenu from './components/GameMenu';
import GameText from './components/GameText';

// Selectors
import { selectDialogMessages } from './redux/selectors/selectDialog';
import { selectMenuItems } from './redux/selectors/selectMenu';
import { selectTexts } from './redux/selectors/selectText';
import { selectGameLocale } from './redux/selectors/selectGameData';

const Game = () => {
    const isDevelopment = process?.env?.NODE_ENV !== 'production';
    const dispatch = useDispatch();
    const [game, setGame] = useState(null);
    const dialogMessages = useSelector(selectDialogMessages);
    const menuItems = useSelector(selectMenuItems);
    const gameTexts = useSelector(selectTexts);
    const locale = useSelector(selectGameLocale);

    const [messages, setMessages] = useState({});

    useEffect(() => {
        async function loadMessages() {
            const module = await import(`./intl/${locale}.json`);
            setMessages(module.default);
        }

        loadMessages();
    }, [locale]);

    const updateGameReduxState = useCallback((
        gameWidth,
        gameHeight,
        gameZoom
    ) => {
        dispatch(setGameHeightAction(gameHeight));
        dispatch(setGameWidthAction(gameWidth));
        dispatch(setGameZoomAction(gameZoom));
    }, [dispatch]);

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
                MainMenuScene,
            ],
            physics: {
                default: 'arcade',
                arcade: {
                    debug: isDevelopment,
                },
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

            // TODO needs to re-run this function to: handleConfigureCamera
            phaserGame.scale.setZoom(gameSize.zoom);
            phaserGame.scale.resize(gameSize.width, gameSize.height);
            updateGameReduxState(gameSize.width, gameSize.height, gameSize.zoom);
        };

        // TODO move to the ResizeObserver https://jsfiddle.net/rudiedirkx/p0ckdcnv/
        window.addEventListener('resize', () => {
            clearTimeout(timeOutFunctionId);
            timeOutFunctionId = setTimeout(workAfterResizeIsDone, RESIZE_THRESHOLD);
        });

        setGame(phaserGame);
        dispatch(setGameCanvasElementAction(phaserGame.canvas));
        if (isDevelopment) {
            window.phaserGame = phaserGame;
        }
    }, [
        game,
        dispatch,
        isDevelopment,
        updateGameReduxState,
    ]);

    return (
        <IntlProvider
            messages={messages}
            locale={locale}
            defaultLocale="en"
        >
            <div
                id="game-content"
                key="game-content"
            >
                {/* this is where the game canvas will be rendered */}
            </div>
            {dialogMessages.length > 0 && (
                <DialogBox />
            )}
            {menuItems.length > 0 && (
                <GameMenu />
            )}
            {gameTexts.length > 0 && gameTexts.map((text) => {
                const { key, variables, config } = text;

                return (
                    <GameText
                        key={key}
                        translationKey={key}
                        variables={variables}
                        config={config}
                    />
                );
            })}
            {isMobile() && (
                <VirtualGamepad />
            )}
        </IntlProvider>
    );
};

export default Game;
