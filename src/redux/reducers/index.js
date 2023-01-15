import { combineReducers } from 'redux';

// Reducers
import loadedAssetsReducer from './loadedAssetsReducer';
import gameDataReducer from './gameDataReducer';
import heroDataReducer from './heroDataReducer';

export default combineReducers({
    loadedAssets: loadedAssetsReducer,
    heroData: heroDataReducer,
    game: gameDataReducer,
});
