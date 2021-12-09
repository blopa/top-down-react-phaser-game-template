import { SET_CURRENT_ROOM } from '../../constants';

const setCurrentRoomAction = (payload) => (dispatch) => dispatch({
    type: SET_CURRENT_ROOM,
    payload,
});

export default setCurrentRoomAction;
