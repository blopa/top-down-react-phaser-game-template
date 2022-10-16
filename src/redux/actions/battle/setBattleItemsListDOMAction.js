import { SET_BATTLE_ITEMS_LIST_DOM } from '../../constants';

const setBattleItemsListDOMAction = (payload) => (dispatch) =>
    dispatch({
        type: SET_BATTLE_ITEMS_LIST_DOM,
        payload,
    });

export default setBattleItemsListDOMAction;
