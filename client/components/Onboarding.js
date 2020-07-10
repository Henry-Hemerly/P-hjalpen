import * as React from 'react';
import {
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import {changeRegNumber, seenOnboarding} from '../actions/counts.js';

// Onboarding4 is in the Bluetooth.js file

function Onboarding5({navigation, seenOnboarding, changeRegNumber}) {
  const [value, setValue] = React.useState('');
  return (
    <SafeAreaView style={style.background}>
      <KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
        <ScrollView>
          <Text style={style.headingTwoLast}>
            Fyll i din bils registreringsnummer
          </Text>
          <View style={style.regNumWrapper}>
            <Image
              style={style.image}
              source={require('../images/sweden.png')}
            />
            <TextInput
              ref={c => (this.text = c)}
              maxLength={6}
              style={style.regNumInput}
              onChangeText={text => {
                setValue(text);
              }}
            />
          </View>
        </ScrollView>
        <View>
          <TouchableOpacity
            style={style.nextButton}
            placeholder="REGNR"
            onPress={() => {
              changeRegNumber(value);
              navigation.replace('HomeApp');
              seenOnboarding(true);
            }}>
            <Text style={style.nextButtonText}>Spara och fortsätt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('HomeApp');
              seenOnboarding(true);
            }}>
            <Text style={style.skipButton}>Hoppa över</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  headingTwoLast: {
    color: '#F5C932',
    fontSize: 32,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: '20%',
    marginTop: 50,
  },
  image: {
    height: 61,
    width: 32,
    position: 'relative',
    top: 19,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  background: {
    backgroundColor: '#001736',
    flex: 1,
    justifyContent: 'space-between',
  },
  nextButton: {
    position: 'relative',
    alignSelf: 'stretch',
    backgroundColor: '#F5C932',
    borderRadius: 34,
    borderWidth: 1,
    marginHorizontal: 22,
    height: Dimensions.get('screen').height * 0.075,
  },
  nextButtonText: {
    alignSelf: 'center',
    position: 'absolute',
    top: '25%',
    fontSize: Dimensions.get('screen').height * 0.03,
    color: '#1E2657',
  },
  skipButton: {
    color: '#fff',
    fontSize: 16,
    alignSelf: 'center',
    lineHeight: 30,
    marginTop: 22,
    marginBottom: 20,
  },
  regNumInput: {
    height: 60,
    backgroundColor: 'white',
    width: '70%',
    marginVertical: 20,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  regNumWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

function mapStateToProps(state) {
  return {
    count: state.count,
  };
}
const mapDispatchToProps = dispatch => ({
  changeRegNumber: regNumber => dispatch(changeRegNumber(regNumber)),
  seenOnboarding: hasSeenOnboarding =>
    dispatch(seenOnboarding(hasSeenOnboarding)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Onboarding5);
