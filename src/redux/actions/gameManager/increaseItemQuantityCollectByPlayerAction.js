import { INCREASE_ITEM_QTY_COLLECTED_BY_PLAYER } from '../../constants';

const increaseItemQuantityCollectByPlayerAction =
    (
        roomId,
        payload
    ) => (dispatch) => dispatch({
        type: INCREASE_ITEM_QTY_COLLECTED_BY_PLAYER,
        payload,
        roomId,
    });

export default increaseItemQuantityCollectByPlayerAction;
