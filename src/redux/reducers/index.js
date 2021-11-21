import { combineReducers } from 'redux';

// Reducers
import loadedAssetsReducer from './loadedAssetsReducer';
import heroDataReducer from './heroDataReducer';
import mapDataReducer from './mapDataReducer';

export default combineReducers({
    loadedAssets: loadedAssetsReducer,
    heroData: heroDataReducer,
    mapData: mapDataReducer,
});
