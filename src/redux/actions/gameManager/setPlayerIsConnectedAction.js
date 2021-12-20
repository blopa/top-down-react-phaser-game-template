import { SET_PLAYER_IS_CONNECTED } from '../../constants';

const setPlayerIsConnectedAction = (roomId, playerId, payload) => (dispatch) => dispatch({
    type: SET_PLAYER_IS_CONNECTED,
    playerId,
    payload,
    roomId,
});

export default setPlayerIsConnectedAction;
