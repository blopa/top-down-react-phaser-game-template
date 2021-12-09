import { SET_PLAYERS } from '../../constants';

const setPlayersAction = (payload) => (dispatch) => dispatch({
    type: SET_PLAYERS,
    payload,
});

export default setPlayersAction;
