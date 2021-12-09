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

        let roomWithSpace;
        let myRoomId;
        Object.entries(rooms).some(([roomId, roomData]) => {
            if (roomData?.players?.length < 4) {
                roomWithSpace = roomId;
                return true;
            }

            return false;
        });

        if (roomWithSpace) {
            myRoomId = roomWithSpace;
            const room = getSelectorData(selectGameRoom(myRoomId));
            room.players.forEach((player) => {
                socket.emit(PLAYER_ADDED_TO_ROOM, JSON.stringify({
                    characterId: player.characterId,
                    playerId: player.playerId,
                }));
            });
        } else {
            myRoomId = uuid();
            dispatch(addPlayerToRoomAction(myRoomId, {
                characterId,
                sessionId,
                playerId,
            }));
        }

        io.to(myRoomId).emit(PLAYER_ADDED_TO_ROOM, JSON.stringify({
            characterId,
            playerId,
        }));

        socket.join(myRoomId);
        socket.emit(SEND_ROOM_ID, myRoomId);
    });
});
