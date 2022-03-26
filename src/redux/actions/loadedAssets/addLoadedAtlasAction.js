import { ADD_LOADED_ATLAS } from '../../constants';

const addLoadedAtlasAction = (payload) => (dispatch) => dispatch({
    type: ADD_LOADED_ATLAS,
    payload,
});

export default addLoadedAtlasAction;
