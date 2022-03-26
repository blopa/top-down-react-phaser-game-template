import { SET_GAME_LOCALE } from '../../constants';

const setGameLocaleAction = (payload) => (dispatch) => dispatch({
    type: SET_GAME_LOCALE,
    payload,
});

export default setGameLocaleAction;
