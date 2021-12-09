import { ADD_PLAYER_TO_ROOM } from '../../constants';

const addPlayerToRoomAction = (payload, roomId) => (dispatch) => dispatch({
    type: ADD_PLAYER_TO_ROOM,
    payload,
    roomId,
});

export default addPlayerToRoomAction;
