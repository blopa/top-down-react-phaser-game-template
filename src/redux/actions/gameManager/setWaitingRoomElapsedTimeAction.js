import { SET_ELAPSED_TIME } from '../../constants';

const setWaitingRoomElapsedTimeAction = (roomId, payload) => (dispatch) => dispatch({
    type: SET_ELAPSED_TIME,
    payload,
    roomId,
});

export default setWaitingRoomElapsedTimeAction;
