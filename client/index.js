/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import React from 'react';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';

import {configureStore} from './store/configureStore';
import {PersistGate} from 'redux-persist/es/integration/react';
import {persistStore} from 'redux-persist';

const store = configureStore();

const persistedStore = persistStore(store);

const RNRedux = () => (
  <Provider store={store}>
    <PersistGate persistor={persistedStore}>
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
