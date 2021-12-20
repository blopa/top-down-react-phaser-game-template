import { SET_MENU_POSITION } from '../../constants';

const setMenuPositionAction = (payload) => (dispatch) => dispatch({
    type: SET_MENU_POSITION,
    payload,
});

export default setMenuPositionAction;
