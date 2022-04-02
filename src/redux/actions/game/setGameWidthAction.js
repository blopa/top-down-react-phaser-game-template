import { SET_GAME_WIDTH } from '../../constants';

const setGameWidthAction = (payload) => (dispatch) => dispatch({
    type: SET_GAME_WIDTH,
    payload,
});

export default setGameWidthAction;
