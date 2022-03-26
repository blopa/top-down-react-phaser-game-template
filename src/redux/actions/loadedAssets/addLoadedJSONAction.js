import { ADD_LOADED_JSON } from '../../constants';

const addLoadedJSONAction = (payload) => (dispatch) => dispatch({
    type: ADD_LOADED_JSON,
    payload,
});

export default addLoadedJSONAction;
