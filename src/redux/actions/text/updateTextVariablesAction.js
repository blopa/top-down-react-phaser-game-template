import { UPDATE_TEXT_VARIABLES } from '../../constants';

const updateTextVariablesAction = (key, variables) => (dispatch) => dispatch({
    type: UPDATE_TEXT_VARIABLES,
    payload: { key, variables },
});

export default updateTextVariablesAction;
