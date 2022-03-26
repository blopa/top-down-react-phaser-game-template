import { SET_GAME_CANVAS } from '../../constants';

const setGameCanvasElementAction = (payload) => (dispatch) => dispatch({
    type: SET_GAME_CANVAS,
    payload,
});

export default setGameCanvasElementAction;
