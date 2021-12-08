import { ADD_PLAYER } from '../constants';

const addPlayerAction = (payload) => (dispatch) => dispatch({
    type: ADD_PLAYER,
    payload,
});

export default addPlayerAction;
