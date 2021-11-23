import {
    ADD_TILESET,
    SET_MAP_KEY,
} from '../constants';

const defaultState = {
    mapKey: '',
    tilesets: [],
};

const mapDataReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_MAP_KEY: {
            return {
                ...state,
                mapKey: action.payload,
            };
        }

        case ADD_TILESET: {
            return {
                ...state,
                tilesets: [
                    ...state.tilesets,
                    action.payload,
                ],
            };
        }

        default:
            return state;
    }
};

export default mapDataReducer;
