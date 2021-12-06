import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

// Constants
import {
    ADD_CHARACTER,
    NEW_GAME,
    MOVE_HERO,
    MOVE_HERO_SERVER,
} from '../utils/serverConstants';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Express
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

server.listen(4000, () => {
    console.log('listening on *:4000');
});

// Socket.io
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on(NEW_GAME, (hero) => {
        console.log('create hero:', hero);
        io.emit(ADD_CHARACTER, hero);
    });
    socket.on(MOVE_HERO, (hero, direction) => {
        console.log('move hero:', hero, direction);
        io.emit(MOVE_HERO_SERVER, hero, direction);
    });
});
