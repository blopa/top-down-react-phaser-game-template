import { combineReducers } from 'redux';

// Reducers
import loadedAssetsReducer from './loadedAssetsReducer';

export default combineReducers({
    loadedAssets: loadedAssetsReducer,
});
