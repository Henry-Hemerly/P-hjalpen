import * as React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {seenOnboarding} from '../actions/counts.js';
import {getMyStringValue} from '../utils/asyncStorage';

function SplashScreen({navigation, seenOnboarding, count}) {
  setTimeout(() => {
    count.hasSeenOnboarding
      ? navigation.navigate('HomeApp')
      : navigation.navigate('Onboarding1');
    return;
  }, 3000);
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#001736',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{fontSize: 130, fontWeight: 'bold', color: 'white'}}>P</Text>
      <View
        style={{
          backgroundColor: '#F5C932',
          height: 11,
          width: 138,
          marginBottom: 25,
        }}
      />
      <Text style={{fontSize: 40, fontWeight: 'bold', color: 'white'}}>
        Hjälpen
      </Text>
    </SafeAreaView>
  );
}

function mapStateToProps(state) {
  return {
    count: state.count,
  };
}
const mapDispatchToProps = dispatch => ({
  seenOnboarding: hasSeenOnboarding =>
    dispatch(seenOnboarding(hasSeenOnboarding)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SplashScreen);
