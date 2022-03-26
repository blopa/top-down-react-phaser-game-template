import { SET_DIALOG_ACTION } from '../../constants';

const setDialogActionAction = (payload) => (dispatch) => dispatch({
    type: SET_DIALOG_ACTION,
    payload,
});

export default setDialogActionAction;
