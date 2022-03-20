import { ADD_TEXT } from '../../constants';

const addTextAction = (payload) => (dispatch) => dispatch({
    type: ADD_TEXT,
    payload,
});

export default addTextAction;
