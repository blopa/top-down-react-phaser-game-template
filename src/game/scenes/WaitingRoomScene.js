import { Scene } from 'phaser';

// Constants
import {
    START_GAME,
    REQUEST_NEW_GAME,
    RESPOND_JOINED_ROOM,
    SEND_WAITING_ELAPSED_TIME,
    RESPOND_PLAYER_ADDED_TO_ROOM,
} from '../../server/constants';
import { DOWN_DIRECTION, IDLE_FRAME, ONE_SECOND } from '../../utils/constants';

// Actions
import addPlayerToRoomAction from '../../redux/actions/gameManager/addPlayerToRoomAction';
import setCurrentRoomAction from '../../redux/actions/gameManager/setCurrentRoomAction';
import setPlayersAction from '../../redux/actions/players/setPlayersAction';
import addTextAction from '../../redux/actions/text/addTextAction';
import removeTextAction from '../../redux/actions/text/removeTextAction';
import updateTextVariablesAction from '../../redux/actions/text/updateTextVariablesAction';

// Utils
import { connectToServer, handleCreateHeroAnimations, startGameScene } from '../../utils/sceneHelpers';
import { getDispatch, getSelectorData } from '../../utils/utils';

// Selectors
import { selectMyCharacterId, selectMyPlayerId } from '../../redux/selectors/selectPlayers';
import { selectGameHeight, selectGameWidth } from '../../redux/selectors/selectGameSettings';
import { selectGameCurrentRoomId } from '../../redux/selectors/selectGameManager';

export default class WaitingRoomScene extends Scene {
    constructor() {
        super('WaitingRoomScene');
    }

    create() {
        const dispatch = getDispatch();
        const gameWidth = getSelectorData(selectGameWidth);
        const gameHeight = getSelectorData(selectGameHeight);
        const spriteName = getSelectorData(selectMyCharacterId);
        const myPlayerId = getSelectorData(selectMyPlayerId);

        const sprite = this.add.sprite(
            gameWidth / 2,
            gameHeight * 0.35,
            spriteName,
            IDLE_FRAME.replace('position', DOWN_DIRECTION)
        ).setName(spriteName).setScale(2);

        handleCreateHeroAnimations(this, spriteName);
        sprite.anims.play(`${spriteName}_walk_${DOWN_DIRECTION}`);

        dispatch(addTextAction({
            key: 'waiting_for_players',
            config: {
                position: 'center',
                color: '#FFFFFF',
                top: gameHeight * 0.2,
                size: 16,
            },
        }));

        const socket = connectToServer();
        socket.emit(REQUEST_NEW_GAME, JSON.stringify({
            characterId: spriteName,
            playerId: myPlayerId,
        }));

        socket.on(RESPOND_JOINED_ROOM, (stringfiedData) => {
            const data = JSON.parse(stringfiedData);
            const { roomId } = data;
            dispatch(setCurrentRoomAction(roomId));
        });

        let timeForGameIntervalHandler = null;
        socket.on(SEND_WAITING_ELAPSED_TIME, (stringfiedData) => {
            dispatch(removeTextAction('game_will_start_in_seconds'));
            dispatch(addTextAction({
                key: 'game_will_start_in_seconds',
                variables: {
                    seconds: '∞',
                },
                config: {
                    position: 'center',
                    color: '#FFFFFF',
                    top: gameHeight * 0.7,
                },
            }));

            const data = JSON.parse(stringfiedData);
            const { elapsedTime } = data;

            clearInterval(timeForGameIntervalHandler);
            let waitingTime = 60 - elapsedTime;
            timeForGameIntervalHandler = setInterval(() => {
                waitingTime -= 1;
                dispatch(updateTextVariablesAction('game_will_start_in_seconds', {
                    seconds: Math.max(waitingTime, 0),
                }));
            }, ONE_SECOND);
        });

        const rivalsSprites = this.add.group();
        socket.on(RESPOND_PLAYER_ADDED_TO_ROOM, (stringfiedData) => {
            const player = JSON.parse(stringfiedData);
            const rivalSprite = this.add.sprite(
                gameWidth / 2,
                gameHeight * 0.5,
                player.characterId,
                IDLE_FRAME.replace('position', DOWN_DIRECTION)
            ).setName(player.characterId);
            rivalsSprites.add(rivalSprite);

            const sprites = rivalsSprites.getChildren();
            const totalWidth = sprites.reduce(
                (acc, curr) => curr.width + acc, 0
            );

            let accWidth = 0;
            sprites.forEach((s) => {
                s.setX((gameWidth / 2) - totalWidth + accWidth + s.width);
                accWidth += s.width * 2;
            });

            // handle animations
            handleCreateHeroAnimations(this, player.characterId);
            rivalSprite.anims.play(`${player.characterId}_walk_${DOWN_DIRECTION}`);

            // add player to the room in the state
            const roomId = getSelectorData(selectGameCurrentRoomId);
            dispatch(addPlayerToRoomAction(roomId, player));
        });

        socket.on(START_GAME, (stringfiedData) => {
            const players = JSON.parse(stringfiedData);
            startGameScene(this, 'main_map', () => {
                clearInterval(timeForGameIntervalHandler);
                return Promise.all([
                    dispatch(removeTextAction('game_will_start_in_seconds')),
                    dispatch(removeTextAction('waiting_for_players')),
                    dispatch(setPlayersAction(players)),
                ]);
            });
        });
    }
}
