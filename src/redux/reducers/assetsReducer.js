const defaultState = {
    fonts: [],
};

const assetsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'ADD_LOADED_FONT':
            return {
                fonts: [
                    ...state.fonts,
                    action.payload,
                ],
            };
        default:
            return state;
    }
};

export default assetsReducer;
