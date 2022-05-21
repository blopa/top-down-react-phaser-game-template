import { SET_BATTLE_ON_SELECT } from '../../constants';

const setBattleOnSelectAction = (payload) => (dispatch) => dispatch({
    type: SET_BATTLE_ON_SELECT,
    payload,
});

export default setBattleOnSelectAction;
