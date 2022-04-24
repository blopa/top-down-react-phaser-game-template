import {
    SET_BATTLE_ITEMS,
    SET_BATTLE_SKILLS,
    SET_BATTLE_ENEMIES,
    SET_BATTLE_ON_SELECT,
} from '../constants';

const defaultState = {
    items: [],
    enemies: [],
    skills: [],
    onSelect: null,
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

        case SET_BATTLE_ON_SELECT: {
            return {
                ...state,
                onSelect: action.payload,
            };
        }

        default:
            return state;
    }
};

export default battleReducer;
