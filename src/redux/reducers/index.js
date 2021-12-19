import { combineReducers } from 'redux';

// Reducers
import loadedAssetsReducer from './loadedAssetsReducer';
import gameSettingsReducer from './gameSettingsReducer';
import gameManagerReducer from './gameManagerReducer';
import heroDataReducer from './heroDataReducer';
import mapDataReducer from './mapDataReducer';
import playersReducer from './playersReducer';
import dialogReducer from './dialogReducer';
import menuReducer from './menuReducer';
import textReducer from './textReducer';

export default combineReducers({
    loadedAssets: loadedAssetsReducer,
    gameSettings: gameSettingsReducer,
    gameManager: gameManagerReducer,
    heroData: heroDataReducer,
    players: playersReducer,
    mapData: mapDataReducer,
    dialog: dialogReducer,
    menu: menuReducer,
    text: textReducer,
});
