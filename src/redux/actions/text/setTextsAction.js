import { SET_TEXTS } from '../../constants';

const setTextsAction = (payload) => (dispatch) => dispatch({
    type: SET_TEXTS,
    payload,
});

export default setTextsAction;
