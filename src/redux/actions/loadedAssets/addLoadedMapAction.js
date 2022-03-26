import { ADD_LOADED_MAP } from '../../constants';

const addLoadedMapAction = (payload) => (dispatch) => dispatch({
    type: ADD_LOADED_MAP,
    payload,
});

export default addLoadedMapAction;
