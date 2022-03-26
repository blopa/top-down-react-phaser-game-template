import { SET_FACING_DIRECTION } from '../../constants';

const setHeroFacingDirectionAction = (payload) => (dispatch) => dispatch({
    type: SET_FACING_DIRECTION,
    payload,
});

export default setHeroFacingDirectionAction;
