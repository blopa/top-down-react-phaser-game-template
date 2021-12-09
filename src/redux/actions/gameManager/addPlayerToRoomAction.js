import { ADD_PLAYER_TO_ROOM } from '../../constants';

const addPlayerToRoomAction = (roomId, payload) => (dispatch) => dispatch({
    type: ADD_PLAYER_TO_ROOM,
    payload,
    roomId,
});

export default addPlayerToRoomAction;
