import { SET_BATTLE_ITEMS } from '../../constants';

const setBattleItemsAction = (payload) => (dispatch) => dispatch({
    type: SET_BATTLE_ITEMS,
    payload,
});

export default setBattleItemsAction;
