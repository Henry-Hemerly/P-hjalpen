import {createStore, combineReducers, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import {createLogger} from 'redux-logger';
import countReducer from '../reducers/countReducers';

const rootReducer = combineReducers({count: countReducer});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['count'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const configureStore = () => {
  return createStore(persistedReducer, applyMiddleware(createLogger()));
};
