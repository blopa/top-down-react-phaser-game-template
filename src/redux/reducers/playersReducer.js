import {
    ADD_PLAYER,
    SET_PLAYERS,
    SET_MY_PLAYER_ID,
    SET_MY_CHARACTER_ID,
} from '../constants';

const defaultState = {
    players: [],
    myPlayerId: null,
};

const playersReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_PLAYER: {
            return {
                ...state,
                players: [
                    ...state.players,
                    action.payload,
                ],
            };
        }

        case SET_PLAYERS: {
            return {
                ...state,
                players: action.payload,
            };
        }

        case SET_MY_PLAYER_ID: {
            return {
                ...state,
                myPlayerId: action.payload,
            };
        }

        case SET_MY_CHARACTER_ID: {
            return {
                ...state,
                myCharacterId: action.payload,
            };
        }

        default:
            return state;
    }
};

export default playersReducer;
