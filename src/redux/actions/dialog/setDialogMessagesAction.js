import { SET_DIALOG_MESSAGES } from '../../constants';

const setDialogMessagesAction = (payload) => (dispatch) => dispatch({
    type: SET_DIALOG_MESSAGES,
    payload,
});

export default setDialogMessagesAction;
