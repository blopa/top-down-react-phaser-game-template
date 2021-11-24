import {
    SET_INITIAL_FRAME,
    SET_INITIAL_POSITION,
    SET_FACING_DIRECTION,
    SET_PREVIOUS_POSITION,
} from '../constants';

const defaultState = {
    facingDirection: '',
    initialPosition: {},
    previousPosition: {},
    initialFrame: '',
};

const heroDataReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_FACING_DIRECTION: {
            return {
                ...state,
                facingDirection: action.payload,
            };
        }

        case SET_INITIAL_POSITION: {
            return {
                ...state,
                initialPosition: action.payload,
            };
        }

        case SET_PREVIOUS_POSITION: {
            return {
                ...state,
                previousPosition: action.payload,
            };
        }

        case SET_INITIAL_FRAME: {
            return {
                ...state,
                initialFrame: action.payload,
            };
        }

        default:
            return state;
    }
};

export default heroDataReducer;
