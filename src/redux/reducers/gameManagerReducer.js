import {
    INCREASE_ITEM_QTY_COLLECTED_BY_PLAYER,
    INCREASE_ELAPSED_TIME,
    SET_GAME_IS_OFFLINE,
    ADD_PLAYER_TO_ROOM,
    SET_CURRENT_ROOM,
    SET_ELAPSED_TIME,
    SET_GAME_STARTED,
    SET_ROOM_PLAYERS,
} from '../constants';

const defaultState = {
    isOffline: false,
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

        case SET_GAME_IS_OFFLINE: {
            return {
                ...state,
                isOffline: payload,
            };
        }

        case SET_GAME_STARTED: {
            return {
                ...state,
                rooms: {
                    ...state.rooms,
                    [roomId]: {
                        ...(state.rooms?.[roomId] || {}),
                        gameStarted: payload,
                    },
                },
            };
        }

        case INCREASE_ELAPSED_TIME: {
            return {
                ...state,
                rooms: {
                    ...state.rooms,
                    [roomId]: {
                        ...(state.rooms?.[roomId] || {}),
                        elapsedTime: (state.rooms?.[roomId]?.elapsedTime || 0) + 1,
                    },
                },
            };
        }

        case SET_ELAPSED_TIME: {
            return {
                ...state,
                rooms: {
                    ...state.rooms,
                    [roomId]: {
                        ...(state.rooms?.[roomId] || {}),
                        elapsedTime: payload,
                    },
                },
            };
        }

        case ADD_PLAYER_TO_ROOM: {
            return {
                ...state,
                rooms: {
                    ...state.rooms,
                    [roomId]: {
                        ...(state.rooms?.[roomId] || {}),
                        players: [
                            ...(state.rooms?.[roomId]?.players || []),
                            payload,
                        ],
                    },
                },
            };
        }

        case INCREASE_ITEM_QTY_COLLECTED_BY_PLAYER: {
            const {
                playerId,
                itemType,
                quantity,
            } = payload;

            return {
                ...state,
                rooms: {
                    ...state.rooms,
                    [roomId]: {
                        ...(state.rooms?.[roomId] || {}),
                        players: (state.rooms?.[roomId]?.players || []).map((player) => {
                            if (player.playerId === playerId) {
                                return {
                                    ...player,
                                    collectedItems: {
                                        ...player?.collectedItems,
                                        [itemType]: (player?.collectedItems?.[itemType] || 0) + quantity,
                                    },
                                };
                            }

                            return player;
                        }),
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
