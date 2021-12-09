import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';

// Constants
import { REQUEST_NEW_GAME, SEND_ROOM_ID } from './constants';

// Utils
import { getSelectorData } from '../utils/sceneHelpers';

// Selectors
import { selectGameRoom, selectGameRooms } from '../redux/selectors/selectGameManager';

// Store
import store from '../redux/store';
import addPlayerToRoomAction from '../redux/actions/gameManager/addPlayerToRoomAction';

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
    const { dispatch } = store;

    socket.on(REQUEST_NEW_GAME, (stringfiedData) => {
        const sessionId = socket.id;
        const data = JSON.parse(stringfiedData);
        const { playerId, characterId } = data;
        const rooms = getSelectorData(selectGameRooms);

        let roomWithSpace;
        let newRoomId;
        Object.entries(rooms).some((roomId, roomData) => {
            if (roomData?.players?.length < 4) {
                roomWithSpace = roomId;
                return true;
            }

            return false;
        });

        if (roomWithSpace) {
            newRoomId = roomWithSpace;
        } else {
            newRoomId = uuid();
            dispatch(addPlayerToRoomAction(newRoomId, {
                characterId,
                sessionId,
                playerId,
            }));
        }

        const room = getSelectorData(selectGameRoom);
        room.players.forEach((player) => {
            const playerSocket = io.sockets.sockets.get(player.sessionId);
        });

        socket.emit(SEND_ROOM_ID, newRoomId);
    });
});
