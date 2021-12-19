import { SET_GAME_DOM_RECT } from '../../constants';

const setGameDomRectAction = (payload) => (dispatch) => dispatch({
    type: SET_GAME_DOM_RECT,
    payload,
});

export default setGameDomRectAction;
