import { SET_GAME_ZOOM } from '../../constants';

const setGameZoomAction = (payload) => (dispatch) => dispatch({
    type: SET_GAME_ZOOM,
    payload,
});

export default setGameZoomAction;
