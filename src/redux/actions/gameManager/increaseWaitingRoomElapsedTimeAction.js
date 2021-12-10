import { INCREASE_ELAPSED_TIME } from '../../constants';

const increaseWaitingRoomElapsedTimeAction = (roomId) => (dispatch) => dispatch({
    type: INCREASE_ELAPSED_TIME,
    roomId,
});

export default increaseWaitingRoomElapsedTimeAction;
