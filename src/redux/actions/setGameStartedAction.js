import { SET_GAME_STARTED } from '../constants';

const setGameStartedAction = (payload) => (dispatch) => dispatch({
    type: SET_GAME_STARTED,
    payload,
});

export default setGameStartedAction;
