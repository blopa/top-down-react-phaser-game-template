import {
    ADD_PLAYER,
    SET_PLAYERS,
    SET_MY_PLAYER_ID,
    SET_MY_CHARACTER_ID,
    INCREASE_ITEM_QTY_COLLECTED,
} from '../constants';

const defaultState = {
    players: [],
    myPlayerId: null,
    myCharacterId: null,
    collectedItems: {},
};

const playersReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_PLAYER: {
            return {
                ...state,
                players: [
                    ...state.players,
                    action.payload,
                ],
            };
        }

        case SET_PLAYERS: {
            return {
                ...state,
                players: action.payload,
            };
        }

        case SET_MY_PLAYER_ID: {
            return {
                ...state,
                myPlayerId: action.payload,
            };
        }

        case SET_MY_CHARACTER_ID: {
            return {
                ...state,
                myCharacterId: action.payload,
            };
        }

        case INCREASE_ITEM_QTY_COLLECTED: {
            const {
                itemType,
                quantity,
            } = action.payload;

            return {
                ...state,
                collectedItems: {
                    ...state?.collectedItems,
                    [itemType]: (state?.collectedItems?.[itemType] || 0) + quantity,
                },
            };
        }

        default:
            return state;
    }
};

export default playersReducer;
