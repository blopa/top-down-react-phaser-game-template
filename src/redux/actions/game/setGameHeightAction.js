import { SET_GAME_HEIGHT } from '../../constants';

const setGameHeightAction = (payload) => (dispatch) => dispatch({
    type: SET_GAME_HEIGHT,
    payload,
});

export default setGameHeightAction;
