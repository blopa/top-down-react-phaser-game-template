import { MIN_GAME_HEIGHT, MIN_GAME_WIDTH } from '../../utils/constants';
import {
    SET_GAME_ZOOM,
    SET_GAME_WIDTH,
    SET_GAME_HEIGHT,
    SET_GAME_LOCALE,
} from '../constants';

const defaultState = {
    width: MIN_GAME_WIDTH,
    height: MIN_GAME_HEIGHT,
    zoom: 1,
    locale: 'en',
};

const gameSettingsReducer = (state = defaultState, action) => {
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

        case SET_GAME_LOCALE: {
            return {
                ...state,
                locale: action.payload,
            };
        }

        default:
            return state;
    }
};

export default gameSettingsReducer;
