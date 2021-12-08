import { combineReducers } from 'redux';

// Reducers
import loadedAssetsReducer from './loadedAssetsReducer';
import gameSettingsReducer from './gameSettingsReducer';
import waitingRoomReducer from './waitingRoomReducer';
import gameDataReducer from './gameDataReducer';
import heroDataReducer from './heroDataReducer';
import mapDataReducer from './mapDataReducer';
import playersReducer from './playersReducer';
import dialogReducer from './dialogReducer';
import menuReducer from './menuReducer';

export default combineReducers({
    loadedAssets: loadedAssetsReducer,
    gameSettings: gameSettingsReducer,
    waitingRoom: waitingRoomReducer,
    heroData: heroDataReducer,
    players: playersReducer,
    mapData: mapDataReducer,
    game: gameDataReducer,
    dialog: dialogReducer,
    menu: menuReducer,
});
