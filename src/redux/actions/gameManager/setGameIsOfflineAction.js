import { SET_GAME_IS_OFFLINE } from '../../constants';

const setGameIsOfflineAction = (payload) => (dispatch) => dispatch({
    type: SET_GAME_IS_OFFLINE,
    payload,
});

export default setGameIsOfflineAction;
