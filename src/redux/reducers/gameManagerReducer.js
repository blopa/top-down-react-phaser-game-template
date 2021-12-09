import {
    ADD_PLAYER_TO_ROOM,
    SET_CURRENT_ROOM,
    SET_ROOM_PLAYERS,
} from '../constants';

const defaultState = {
    currentRoom: null,
    rooms: {},
};

const gameManagerReducer = (state = defaultState, action) => {
    const { type, payload, roomId } = action;
    switch (type) {
        case SET_CURRENT_ROOM: {
            return {
                ...state,
                currentRoom: payload,
            };
        }

        case ADD_PLAYER_TO_ROOM: {
            return {
                ...state,
                rooms: {
                    ...state.rooms,
                    [roomId]: {
                        ...(state.rooms?.[roomId] || []),
                        players: [
                            ...(state.rooms?.[roomId]?.players || []),
                            payload,
                        ],
                    },
                },
            };
        }

        case SET_ROOM_PLAYERS: {
            return {
                ...state,
                rooms: {
                    ...state.rooms,
                    [roomId]: payload,
                },
            };
        }

        default:
            return state;
    }
};

export default gameManagerReducer;
