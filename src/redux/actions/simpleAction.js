export const simpleAction = (payload) => dispatch => {
    return dispatch({
        type: 'SIMPLE_ACTION',
        payload,
    })
}
