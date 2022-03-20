import { SET_MENU_ON_SELECT } from '../../constants';

const setMenuOnSelectAction = (payload) => (dispatch) => dispatch({
    type: SET_MENU_ON_SELECT,
    payload,
});

export default setMenuOnSelectAction;
