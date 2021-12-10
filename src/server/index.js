import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';

// Constants
import { PLAYER_ADDED_TO_ROOM, REQUEST_NEW_GAME, SEND_ROOM_ID } from './constants';

// Utils
import { getDispatch, getSelectorData } from '../utils/utils';

// Selectors
import { selectGameRoom, selectGameRooms } from '../redux/selectors/selectGameManager';

// Actions
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
    const dispatch = getDispatch();

    socket.on(REQUEST_NEW_GAME, (stringfiedData) => {
        const sessionId = socket.id;
        const data = JSON.parse(stringfiedData);
        const { playerId, characterId } = data;
        const rooms = getSelectorData(selectGameRooms);

        const result = Object.entries(rooms).find(
            ([roomId, roomData]) => roomData?.players?.length < 4
        );

        let [roomId, roomData] = result || [];

        if (roomId) {
            // send to the current socket all other
            // players already in the room
            const room = getSelectorData(selectGameRoom(roomId));
            room.players.forEach((player) => {
                socket.emit(PLAYER_ADDED_TO_ROOM, JSON.stringify({
                    characterId: player.characterId,
                    playerId: player.playerId,
                }));
            });
        } else {
            roomId = uuid();
        }

        dispatch(addPlayerToRoomAction(roomId, {
            characterId,
            sessionId,
            playerId,
        }));

        io.to(roomId).emit(PLAYER_ADDED_TO_ROOM, JSON.stringify({
            characterId,
            playerId,
        }));

        socket.join(roomId);
        socket.emit(SEND_ROOM_ID, roomId);
    });
});
