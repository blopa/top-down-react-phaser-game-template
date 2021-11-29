import {
    ADD_MENU_ITEM,
    SET_MENU_ITEMS,
    SET_MENU_POSITION,
    SET_MENU_ON_SELECT,
} from '../constants';

const defaultState = {
    items: [],
    position: 'center',
    onSelect: null,
};

const menuReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_MENU_ITEMS: {
            return {
                ...state,
                items: action.payload,
            };
        }

        case SET_MENU_ON_SELECT: {
            return {
                ...state,
                onSelect: action.payload,
            };
        }

        case SET_MENU_POSITION: {
            return {
                ...state,
                position: action.payload,
            };
        }

        case ADD_MENU_ITEM: {
            return {
                ...state,
                items: [
                    ...state.items,
                    action.payload,
                ],
            };
        }

        default:
            return state;
    }
};

export default menuReducer;
