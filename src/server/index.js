import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';

// Constants
import {
    START_GAME, MOVE_CHARACTER,
    SEND_WAITING_ELAPSED_TIME,
    APPROVE_RECONNECTION,
    PLAYER_ADDED_TO_ROOM,
    REQUEST_RECONNECTION,
    PLAYER_DISCONNECTED,
    RECONNECTION_FAILED,
    REQUEST_NEW_GAME,
    SEND_JOINED_ROOM,
    TILE_PUSHED,
} from './constants';
import { ONE_SECOND, WAITING_ROOM_TIMEOUT } from '../utils/constants';

// Utils
import { getDispatch, getSelectorData } from '../utils/utils';

// Selectors
import {
    selectGameRoom,
    selectGameRooms,
    selectGameStarted,
    selectGameElapsedTime,
} from '../redux/selectors/selectGameManager';

// Actions
import addPlayerToRoomAction from '../redux/actions/gameManager/addPlayerToRoomAction';
import setGameStartedAction from '../redux/actions/game/setGameStartedAction';
import increaseWaitingRoomElapsedTimeAction from '../redux/actions/gameManager/increaseWaitingRoomElapsedTimeAction';
import setPlayerIsConnectedAction from '../redux/actions/gameManager/setPlayerIsConnectedAction';

dotenv.config({});
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Express
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

const serverPort = process.env.REACT_APP_SERVER_PORT || 4000;
server.listen(serverPort, () => {
    console.log(`listening on *:${serverPort}`);
});

// Socket.io
io.on('connection', (socket) => {
    const dispatch = getDispatch();
    const sessionId = socket.id;
    const positionsMap = {
        0: { x: 0, y: 0 },
        1: { x: 19, y: 0 },
        2: { x: 19, y: 19 },
        3: { x: 0, y: 19 },
    };
    const commonListeners = (so, roomId) => {
        socket.on(MOVE_CHARACTER, (stringfiedData) => {
            // const data = JSON.parse(stringfiedData);
            io.to(roomId).emit(MOVE_CHARACTER, stringfiedData);
        });

        socket.on(TILE_PUSHED, (stringfiedData) => {
            // const tile = JSON.parse(stringfiedData);
            io.to(roomId).emit(TILE_PUSHED, stringfiedData);
        });
    };

    socket.on(REQUEST_RECONNECTION, (stringfiedData) => {
        const data = JSON.parse(stringfiedData);
        const { roomId, playerId } = data;
        const room = getSelectorData(selectGameRoom(roomId));

        const player = room?.players.find(
            (p) => p.playerId === playerId && p.isConnected === false
        );

        if (player) {
            dispatch(setPlayerIsConnectedAction(roomId, playerId, true));
            socket.emit(APPROVE_RECONNECTION, JSON.stringify(room?.players.map((p) => ({
                ...p,
                sessionId: null,
            }))));

            commonListeners(
                socket,
                roomId
            );
        } else {
            socket.emit(RECONNECTION_FAILED);
        }
    });

    socket.on(REQUEST_NEW_GAME, (stringfiedData) => {
        const data = JSON.parse(stringfiedData);
        const { playerId, characterId } = data;
        const rooms = getSelectorData(selectGameRooms);

        const result = Object.entries(rooms).find(
            ([, roomData]) => roomData?.players?.length < 4 && !roomData?.gameStarted
        );

        let [roomId, roomData] = result || [];

        if (roomId) {
            // send to the current socket all other
            // players already in the room
            const room = getSelectorData(selectGameRoom(roomId));
            room?.players.forEach((player) => {
                socket.emit(PLAYER_ADDED_TO_ROOM, JSON.stringify({
                    ...player,
                    sessionId: null,
                }));
            });
        } else {
            roomId = uuid();
        }

        // create player objects
        const player = {
            position: positionsMap[roomData?.players.length || 0],
            isConnected: true,
            characterId,
            sessionId,
            playerId,
        };

        // TODO add this to the reconnect too
        socket.on('disconnect', () => {
            dispatch(setPlayerIsConnectedAction(roomId, playerId, false));
            io.to(roomId).emit(PLAYER_DISCONNECTED, JSON.stringify({
                playerId,
            }));
        });

        commonListeners(
            socket,
            roomId
        );

        // this automatically creates a room if it doesn't exist
        dispatch(addPlayerToRoomAction(roomId, player));

        io.to(roomId).emit(PLAYER_ADDED_TO_ROOM, JSON.stringify({
            ...player,
            sessionId: null,
        }));

        socket.join(roomId);
        socket.emit(SEND_JOINED_ROOM, JSON.stringify({
            roomId,
        }));

        const room = getSelectorData(selectGameRoom(roomId));
        if (room?.players.length === 4) {
            dispatch(setGameStartedAction(roomId, true));
            io.to(roomId).emit(START_GAME, JSON.stringify(room?.players.map((p) => ({
                ...p,
                sessionId: null,
            }))));
        } else {
            const gameStarted = getSelectorData(selectGameStarted(roomId));

            if (!gameStarted && room?.players.length >= 2) {
                const elapsedTime = getSelectorData(selectGameElapsedTime(roomId));
                io.to(roomId).emit(SEND_WAITING_ELAPSED_TIME, JSON.stringify({
                    elapsedTime: elapsedTime || 0,
                }));

                let timeForGameIntervalHandler;
                if (!Number.isFinite(elapsedTime)) {
                    timeForGameIntervalHandler = setInterval(() => {
                        dispatch(increaseWaitingRoomElapsedTimeAction(roomId));
                    }, ONE_SECOND);
                }

                setTimeout(() => {
                    clearInterval(timeForGameIntervalHandler);
                    dispatch(setGameStartedAction(roomId, true));
                    io.to(roomId).emit(START_GAME, JSON.stringify(room?.players.map((p) => ({
                        ...p,
                        sessionId: null,
                    }))));
                }, WAITING_ROOM_TIMEOUT);
            }
        }
    });
});
