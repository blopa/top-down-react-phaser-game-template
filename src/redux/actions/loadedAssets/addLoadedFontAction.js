import { ADD_LOADED_FONT } from '../../constants';

const addLoadedFontAction = (payload) => (dispatch) => dispatch({
    type: ADD_LOADED_FONT,
    payload,
});

export default addLoadedFontAction;
