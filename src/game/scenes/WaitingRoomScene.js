import { Scene } from 'phaser';
import io from 'socket.io-client';

// Constants
import {
    PLAYER_ADDED_TO_ROOM,
    REQUEST_NEW_GAME,
    SEND_JOINED_ROOM,
    SEND_WAITING_ELAPSED_TIME,
} from '../../server/constants';
import { DOWN_DIRECTION, IDLE_FRAME, ONE_SECOND } from '../../utils/constants';

// Actions
import addPlayerToRoomAction from '../../redux/actions/gameManager/addPlayerToRoomAction';
import setCurrentRoomAction from '../../redux/actions/gameManager/setCurrentRoomAction';

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

        this.add.text(
            gameWidth / 2,
            gameHeight * 0.2,
            'Waiting For\nOther Players',
            {
                fontFamily: '"Press Start 2P"',
                color: '#FFFFFF',
            }
        ).setOrigin(0.5);

        const socket = connectToServer();
        socket.emit(REQUEST_NEW_GAME, JSON.stringify({
            characterId: spriteName,
            playerId: myPlayerId,
        }));

        socket.on(SEND_JOINED_ROOM, (stringfiedData) => {
            const data = JSON.parse(stringfiedData);
            const { roomId } = data;
            dispatch(setCurrentRoomAction(roomId));
        });

        const timeForGame = this.add.text(
            gameWidth / 2,
            gameHeight * 0.7,
            '',
            {
                fontFamily: '"Press Start 2P"',
                color: '#FFFFFF',
            }
        ).setOrigin(0.5);

        let timeForGameIntervalHandler = null;
        socket.on(SEND_WAITING_ELAPSED_TIME, (stringfiedData) => {
            const data = JSON.parse(stringfiedData);
            const { elapsedTime } = data;

            clearInterval(timeForGameIntervalHandler);
            let waitingTime = 60 - elapsedTime;
            timeForGameIntervalHandler = setInterval(() => {
                waitingTime -= 1;
                timeForGame.setText(
                    `Game will start in ${Math.max(waitingTime, 0)} seconds`
                );
            }, ONE_SECOND);
        });

        const rivalsSprites = this.add.group();
        socket.on(PLAYER_ADDED_TO_ROOM, (stringfiedData) => {
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

        startGameScene(this, 'main_map', () => {
            clearInterval(timeForGameIntervalHandler);
        });
    }
}
