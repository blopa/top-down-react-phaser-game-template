import {
    SET_BATTLE_ITEMS,
    SET_BATTLE_ENEMIES,
    SET_BATTLE_SKILLS,
} from '../constants';

const defaultState = {
    items: [],
    enemies: [],
    skills: [],
};

const battleReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_BATTLE_ITEMS: {
            return {
                ...state,
                items: action.payload,
            };
        }

        case SET_BATTLE_ENEMIES: {
            return {
                ...state,
                enemies: action.payload,
            };
        }

        case SET_BATTLE_SKILLS: {
            return {
                ...state,
                skills: action.payload,
            };
        }

        default:
            return state;
    }
};

export default battleReducer;
