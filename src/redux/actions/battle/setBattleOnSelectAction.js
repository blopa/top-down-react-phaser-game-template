import { SET_BATTLE_ON_SELECT } from '../../constants';

const setBattleSkillsAction = (payload) => (dispatch) => dispatch({
    type: SET_BATTLE_ON_SELECT,
    payload,
});

export default setBattleSkillsAction;
