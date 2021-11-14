import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

function configureStore(initialState = {}) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
}

export default configureStore();
