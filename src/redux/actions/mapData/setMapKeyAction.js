import { SET_MAP_KEY } from '../../constants';

const setMapKeyAction = (payload) => (dispatch) => dispatch({
    type: SET_MAP_KEY,
    payload,
});

export default setMapKeyAction;
