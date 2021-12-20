import { SET_MY_CHARACTER_ID } from '../../constants';

const setMyCharacterIdAction = (payload) => (dispatch) => dispatch({
    type: SET_MY_CHARACTER_ID,
    payload,
});

export default setMyCharacterIdAction;
