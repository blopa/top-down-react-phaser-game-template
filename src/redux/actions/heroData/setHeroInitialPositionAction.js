import { SET_INITIAL_POSITION } from '../../constants';

const setHeroInitialPositionAction = (payload) => (dispatch) => dispatch({
    type: SET_INITIAL_POSITION,
    payload,
});

export default setHeroInitialPositionAction;
