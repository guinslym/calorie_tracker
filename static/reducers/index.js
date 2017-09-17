import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authReducer from './auth';
import mealReducer from './meals';
import userReducer from './users';

export default combineReducers({
    auth: authReducer,
    meals: mealReducer,
    users: userReducer,
    routing: routerReducer
});