import { SET_INITIAL_FRAME } from '../../constants';

const setHeroInitialFrameAction = (payload) => (dispatch) => dispatch({
    type: SET_INITIAL_FRAME,
    payload,
});

export default setHeroInitialFrameAction;
