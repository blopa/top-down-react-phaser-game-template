import { ADD_MENU_ITEM } from '../../constants';

const addMenuItemAction = (payload) => (dispatch) => dispatch({
    type: ADD_MENU_ITEM,
    payload,
});

export default addMenuItemAction;
