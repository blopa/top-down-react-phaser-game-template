import {
    ADD_TEXT,
    SET_TEXTS,
    REMOVE_TEXT,
    UPDATE_TEXT_VARIABLES,
} from '../constants';

// example = {
//     key: 'go',
//     config: {
//         position: 'center',
//         color: '#FFFFFF',
//         top: 0,
//     },
//     variables: {},
// }

const defaultState = {
    texts: [],
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

        case UPDATE_TEXT_VARIABLES: {
            const {
                key,
                variables,
            } = action.payload;

            return {
                ...state,
                texts: [
                    ...state.texts.map((text) => {
                        if (text.key === key) {
                            return {
                                ...text,
                                variables,
                            };
                        }

                        return text;
                    }),
                ],
            };
        }

        case REMOVE_TEXT: {
            return {
                ...state,
                texts: [
                    ...state.texts.filter(
                        (text) => text.key !== action.payload
                    ),
                ],
            };
        }

        default:
            return state;
    }
};

export default textReducer;
