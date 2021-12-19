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
} from './utils/constants';

// Game Scenes
import GameScene from './game/scenes/GameScene';
import BootScene from './game/scenes/BootScene';
import MainMenuScene from './game/scenes/MainMenuScene';
import ReconnectScene from './game/scenes/ReconnectScene';
import LoadAssetsScene from './game/scenes/LoadAssetsScene';
import WaitingRoomScene from './game/scenes/WaitingRoomScene';
import CharacterSelectionScene from './game/scenes/CharacterSelectionScene';

// Actions
import setGameHeightAction from './redux/actions/gameSettings/setGameHeightAction';
import setGameWidthAction from './redux/actions/gameSettings/setGameWidthAction';
import setGameZoomAction from './redux/actions/gameSettings/setGameZoomAction';
import setGameDomRectAction from './redux/actions/gameSettings/setGameDomRectAction';

// Components
import DialogBox from './components/DialogBox';
import VirtualGamepad from './components/VirtualGamepad';
import GameMenu from './components/GameMenu';
import GameText from './components/GameText';

// Selectors
import { selectMenuItems } from './redux/selectors/selectMenu';
import { selectDialogMessages } from './redux/selectors/selectDialog';
import { selectGameLocale } from './redux/selectors/selectGameSettings';
import { selectTexts } from './redux/selectors/selectText';

const Game = () => {
    const isDevelopment = process?.env?.NODE_ENV !== 'production';
    const dispatch = useDispatch();
    const [game, setGame] = useState(null);
    const dialogMessages = useSelector(selectDialogMessages);
    const menuItems = useSelector(selectMenuItems);
    const locale = useSelector(selectGameLocale);
    const gameTexts = useSelector(selectTexts);

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
        gameZoom,
        domRect
    ) => {
        console.log(domRect.top, domRect.y);
        dispatch(setGameHeightAction(gameHeight));
        dispatch(setGameWidthAction(gameWidth));
        dispatch(setGameDomRectAction(domRect));
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
                CharacterSelectionScene,
                WaitingRoomScene,
                ReconnectScene,
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

        const domRect = phaserGame?.canvas?.getBoundingClientRect();
        updateGameReduxState(width, height, zoom, domRect);

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
            const rect = phaserGame?.canvas?.getBoundingClientRect();
            updateGameReduxState(gameSize.width, gameSize.height, gameSize.zoom, rect);
            phaserGame.scale.resize(gameSize.width, gameSize.height);
            phaserGame.scale.setZoom(gameSize.zoom);
        };

        window.addEventListener('resize', () => {
            clearTimeout(timeOutFunctionId);
            timeOutFunctionId = setTimeout(workAfterResizeIsDone, RESIZE_THRESHOLD);
        });

        setGame(phaserGame);
        if (isDevelopment) {
            window.phaserGame = phaserGame;
        }
    }, [
        game,
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
