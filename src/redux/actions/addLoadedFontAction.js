/* eslint-disable import/prefer-default-export */
export const addLoadedFontAction = (payload) => (dispatch) => dispatch({
    type: 'ADD_LOADED_FONT',
    payload,
});
