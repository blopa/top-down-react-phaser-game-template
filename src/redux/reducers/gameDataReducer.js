import { MIN_GAME_HEIGHT, MIN_GAME_WIDTH } from '../../constants';
import {
    SET_GAME_ZOOM,
    SET_GAME_WIDTH,
    SET_GAME_HEIGHT,
} from '../constants';

const defaultState = {
    width: MIN_GAME_WIDTH,
    height: MIN_GAME_HEIGHT,
    zoom: 1,
};

const gameDataReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_GAME_WIDTH: {
            return {
                ...state,
                width: action.payload,
            };
        }

        case SET_GAME_HEIGHT: {
            return {
                ...state,
                height: action.payload,
            };
        }

        case SET_GAME_ZOOM: {
            return {
                ...state,
                zoom: action.payload,
            };
        }

        default:
            return state;
    }
};

export default gameDataReducer;
