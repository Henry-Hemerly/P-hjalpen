import React from 'react';
import {Provider} from 'react-redux';
import countReducer from '../reducers/countReducers';

require('react-native-mock-render/mock');
jest.mock('react-native', () => require('react-native-mock-render'), {
  virtual: true,
});
jest.mock('react-native-gesture-handler', () => {});
jest.mock('@react-navigation/stack', () => {});

import {
  changeCount,
  changeParkedPos,
  setInvalidTime,
  changeCarConnection,
} from '../actions/counts.js';

import App from '../App';
import configureStore from '../store/configureStore';
import Bluetooth from '../components/Bluetooth';
import Contacts from '../components/Contacts';
import Home from '../components/Home';
import MyCar from '../components/MyCar';
import Onboarding from '../components/Onboarding';
import Settings from '../components/Settings';
import How from '../components/How';

const store = configureStore();

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<App />);
  expect(tree).toMatchSnapshot();
});
