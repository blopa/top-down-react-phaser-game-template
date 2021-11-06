const defaultState = {
    number: 0,
};

const simpleReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'SIMPLE_ACTION':
            return {
                number: state.number + 1,
            };
        default:
            return state;
    }
};

export default simpleReducer;
