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

// Components
import DialogBox from './components/DialogBox';
import VirtualGamepad from './components/VirtualGamepad';
import GameMenu from './components/GameMenu';

// Selectors
import { selectMenuItems } from './redux/selectors/selectMenu';
import { selectDialogMessages } from './redux/selectors/selectDialog';
import { selectGameLocale } from './redux/selectors/selectGameSettings';

const Game = () => {
    const dispatch = useDispatch();
    const [game, setGame] = useState(null);
    const dialogMessages = useSelector(selectDialogMessages);
    const menuItems = useSelector(selectMenuItems);
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
                CharacterSelectionScene,
                WaitingRoomScene,
                ReconnectScene,
            ],
            physics: {
                default: 'arcade',
                arcade: {
                    debug: process?.env?.NODE_ENV !== 'production',
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
            {isMobile() && (
                <VirtualGamepad />
            )}
        </IntlProvider>
    );
};

export default Game;
