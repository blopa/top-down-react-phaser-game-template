import {
    ADD_PLAYER_TO_WAITING_ROOM,
} from '../constants';

const defaultState = {
    waitingRoom: [],
};

const waitingRoomReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_PLAYER_TO_WAITING_ROOM: {
            return {
                ...state,
                waitingRoom: [
                    ...state.waitingRoom,
                    action.payload,
                ],
            };
        }

        default:
            return state;
    }
};

export default waitingRoomReducer;
