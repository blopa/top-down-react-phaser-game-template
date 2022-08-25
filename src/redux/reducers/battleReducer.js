import {
    SET_BATTLE_ITEMS,
    SET_BATTLE_SKILLS,
    SET_BATTLE_ENEMIES,
    SET_BATTLE_ON_SELECT,
    SET_BATTLE_PICKED_ATTACK,
    SET_BATTLE_ITEMS_LIST_DOM,
    SET_BATTLE_ENEMIES_PICKED_ATTACK,
} from '../constants';

const defaultState = {
    items: [],
    enemies: [],
    skills: [],
    onSelect: null,
    pickedItem: null,
    enemiesPickedItem: null,
};

const battleReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_BATTLE_ITEMS: {
            return {
                ...state,
                items: action.payload,
            };
        }

        case SET_BATTLE_PICKED_ATTACK: {
            return {
                ...state,
                pickedItem: action.payload,
            };
        }

        case SET_BATTLE_ENEMIES_PICKED_ATTACK: {
            return {
                ...state,
                enemiesPickedItem: action.payload,
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

        case SET_BATTLE_ITEMS_LIST_DOM: {
            return {
                ...state,
                itemsListDOM: action.payload,
            };
        }

        default:
            return state;
    }
};

export default battleReducer;
