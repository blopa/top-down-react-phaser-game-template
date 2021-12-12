import { INCREASE_ITEM_QTY_COLLECTED } from '../../constants';

const setItemCollectedAction = (payload) => (dispatch) => dispatch({
    type: INCREASE_ITEM_QTY_COLLECTED,
    payload,
});

export default setItemCollectedAction;
