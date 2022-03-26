import { SET_MENU_ITEMS } from '../../constants';

const setMenuItemsAction = (payload) => (dispatch) => dispatch({
    type: SET_MENU_ITEMS,
    payload,
});

export default setMenuItemsAction;
