import { SET_GAME_STARTED } from '../../constants';

const setGameStartedAction = (roomId, payload) => (dispatch) => dispatch({
    type: SET_GAME_STARTED,
    payload,
    roomId,
});

export default setGameStartedAction;
