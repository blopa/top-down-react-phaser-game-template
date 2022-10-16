import { SET_BATTLE_SKILLS } from '../../constants';

const setBattleSkillsAction = (payload) => (dispatch) =>
    dispatch({
        type: SET_BATTLE_SKILLS,
        payload,
    });

export default setBattleSkillsAction;
