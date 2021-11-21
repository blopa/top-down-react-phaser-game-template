import {
    ADD_LOADED_MAP,
    ADD_LOADED_FONT,
    ADD_LOADED_JSON,
    ADD_LOADED_ATLAS,
    ADD_LOADED_IMAGE,
} from '../constants';

const defaultState = {
    fonts: [],
    atlases: [],
    images: [],
    maps: [],
    jsons: [],
};

const loadedAssetsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_LOADED_FONT: {
            return {
                ...state,
                fonts: [
                    ...state.fonts,
                    action.payload,
                ],
            };
        }

        case ADD_LOADED_ATLAS: {
            return {
                ...state,
                atlases: [
                    ...state.atlases,
                    action.payload,
                ],
            };
        }

        case ADD_LOADED_IMAGE: {
            return {
                ...state,
                images: [
                    ...state.images,
                    action.payload,
                ],
            };
        }

        case ADD_LOADED_MAP: {
            return {
                ...state,
                maps: [
                    ...state.maps,
                    action.payload,
                ],
            };
        }

        case ADD_LOADED_JSON: {
            return {
                ...state,
                jsons: [
                    ...state.jsons,
                    action.payload,
                ],
            };
        }

        default:
            return state;
    }
};

export default loadedAssetsReducer;
