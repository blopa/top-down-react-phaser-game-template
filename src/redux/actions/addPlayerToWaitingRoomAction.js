import { ADD_PLAYER_TO_WAITING_ROOM } from '../constants';

const addPlayerToWaitingRoomAction = (payload) => (dispatch) => dispatch({
    type: ADD_PLAYER_TO_WAITING_ROOM,
    payload,
});

export default addPlayerToWaitingRoomAction;
