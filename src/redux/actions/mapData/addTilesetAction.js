import { ADD_TILESET } from '../../constants';

const addTilesetAction = (payload) => (dispatch) => dispatch({
    type: ADD_TILESET,
    payload,
});

export default addTilesetAction;
