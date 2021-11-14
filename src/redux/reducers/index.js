import { combineReducers } from 'redux';
import assetsReducer from './assetsReducer';

export default combineReducers({
    assets: assetsReducer,
});
