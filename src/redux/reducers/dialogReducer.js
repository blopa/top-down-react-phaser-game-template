import {
    SET_DIALOG_ACTION,
    SET_DIALOG_MESSAGES,
    SET_DIALOG_CHARACTER_NAME,
} from '../constants';

const defaultState = {
    messages: [],
    action: null,
    characterName: '',
};

const dialogReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_DIALOG_MESSAGES: {
            return {
                ...state,
                messages: action.payload,
            };
        }

        case SET_DIALOG_ACTION: {
            return {
                ...state,
                action: action.payload,
            };
        }

        case SET_DIALOG_CHARACTER_NAME: {
            return {
                ...state,
                characterName: action.payload,
            };
        }

        default:
            return state;
    }
};

export default dialogReducer;
