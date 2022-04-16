import { SET_GAME_CAMERA_SIZE_CALLBACK } from '../../constants';

const setGameCameraSizeUpdateCallbackAction = (payload) => (dispatch) => dispatch({
    type: SET_GAME_CAMERA_SIZE_CALLBACK,
    payload,
});

export default setGameCameraSizeUpdateCallbackAction;
