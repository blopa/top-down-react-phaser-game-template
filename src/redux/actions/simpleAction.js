/* eslint-disable import/prefer-default-export */
export const simpleAction = (payload) => (dispatch) => dispatch({
    type: 'SIMPLE_ACTION',
    payload,
});
