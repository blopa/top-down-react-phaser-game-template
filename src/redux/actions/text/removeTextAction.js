import { REMOVE_TEXT } from '../../constants';

const removeTextAction = (payload) => (dispatch) => dispatch({
    type: REMOVE_TEXT,
    payload,
});

export default removeTextAction;
