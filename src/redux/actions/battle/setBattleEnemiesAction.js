import { SET_BATTLE_ENEMIES } from '../../constants';

const setBattleEnemiesAction = (payload) => (dispatch) =>
    dispatch({
        type: SET_BATTLE_ENEMIES,
        payload,
    });

export default setBattleEnemiesAction;
