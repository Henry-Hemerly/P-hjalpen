import * as React from 'react';
import {
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {changeRegNumber, seenOnboarding} from '../actions/counts.js';
import {setStringValue} from '../utils/asyncStorage';

function Onboarding1({navigation, seenOnboarding, count}) {
  return (
    <SafeAreaView style={style.background}>
      <View style={{marginTop: 50}}>
        <Text style={style.heading}>Nu är det slut på{'\n'}P-böter!</Text>
        <Text style={style.description}>
          Våra tester som vi utfört på bilägare i Stockholm visar att de
          minskade risken för att få P-böter upp till 70%.
        </Text>
      </View>
      <View style={{marginBottom: 20}}>
        <TouchableOpacity
          style={style.nextButton}
          onPress={() => navigation.navigate('Onboarding2')}>
          <Text style={style.nextButtonText}>Nästa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            seenOnboarding(true);
            navigation.replace('HomeApp');
          }}>
          <Text style={style.skipButton}>Hoppa över</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  heading: {
    color: '#F5C932',
    fontSize: 57,
    textAlign: 'left',
    fontWeight: '700',
    marginLeft: 28,
    marginRight: 90,
  },
  description: {
    color: 'white',
    fontSize: 22,
    marginHorizontal: '7%',
    lineHeight: 36,
    marginTop: '20%',
  },

  background: {
    backgroundColor: '#001736',
    flex: 1,
    justifyContent: 'space-between',
  },
  nextButton: {
    alignSelf: 'stretch',
    backgroundColor: '#F5C932',
    borderRadius: 34,
    borderWidth: 1,
    marginHorizontal: 22,
    height: 68,
  },
  nextButtonText: {
    alignSelf: 'center',
    paddingVertical: 21,
    fontSize: 22,
    color: '#1E2657',
    fontSize: Dimensions.get('screen').height * 0.022,
  },
  skipButton: {
    color: '#fff',
    fontSize: 16,
    alignSelf: 'center',
    lineHeight: 30,
    marginTop: 22,
  },
});

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
)(Onboarding1);
