import { SET_PREVIOUS_POSITION } from '../../constants';

const setHeroPreviousPositionAction = (payload) => (dispatch) => dispatch({
    type: SET_PREVIOUS_POSITION,
    payload,
});

export default setHeroPreviousPositionAction;
