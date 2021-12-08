import {
    SET_GAME_STARTED,
} from '../constants';

const defaultState = {
    gameStarted: false,
};

const gameDataReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_GAME_STARTED: {
            return {
                ...state,
                gameStarted: action.payload,
            };
        }

        default:
            return state;
    }
};

export default gameDataReducer;
