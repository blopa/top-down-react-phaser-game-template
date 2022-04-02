import { SET_DIALOG_CHARACTER_NAME } from '../../constants';

const setDialogCharacterNameAction = (payload) => (dispatch) => dispatch({
    type: SET_DIALOG_CHARACTER_NAME,
    payload,
});

export default setDialogCharacterNameAction;
