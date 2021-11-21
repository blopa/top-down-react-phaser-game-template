import {
    SET_FACING_DIRECTION,
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

        default:
            return state;
    }
};

export default heroDataReducer;
