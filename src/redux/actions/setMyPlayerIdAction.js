import { SET_MY_PLAYER_ID } from '../constants';

const setMyPlayerIdAction = (payload) => (dispatch) => dispatch({
    type: SET_MY_PLAYER_ID,
    payload,
});

export default setMyPlayerIdAction;
