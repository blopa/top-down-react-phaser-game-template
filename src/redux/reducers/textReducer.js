import {
    ADD_TEXT,
    SET_TEXTS,
} from '../constants';

const defaultState = {
    texts: [{
        key: 'go',
        config: {
            position: 'center',
        },
        variables: {},
    }],
};

const textReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_TEXTS: {
            return {
                ...state,
                texts: action.payload,
            };
        }

        case ADD_TEXT: {
            return {
                ...state,
                texts: [
                    ...state.texts,
                    action.payload,
                ],
            };
        }

        default:
            return state;
    }
};

export default textReducer;
