import { ADD_LOADED_IMAGE } from '../../constants';

const addLoadedImageAction = (payload) => (dispatch) => dispatch({
    type: ADD_LOADED_IMAGE,
    payload,
});

export default addLoadedImageAction;
