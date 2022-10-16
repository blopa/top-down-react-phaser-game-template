import { SET_BATTLE_PICKED_ATTACK } from '../../constants';

const setBattlePickedItemAction = (payload) => (dispatch) =>
    dispatch({
        type: SET_BATTLE_PICKED_ATTACK,
        payload,
    });

export default setBattlePickedItemAction;
