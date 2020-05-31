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

function Onboarding5({navigation, changeRegNumber}) {
  const [value, setValue] = React.useState('');
  return (
    <SafeAreaView style={style.background}>
      <KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
        <ScrollView style={{marginTop: 50}}>
          <Text style={style.headingTwoLast}>
            Fyll i din bils registreringsnummer
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
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
        <View style={{marginBottom: 20}}>
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
  heading: {
    color: '#F5C932',
    fontSize: 57,
    textAlign: 'left',
    fontWeight: '700',
    marginLeft: 28,
    marginRight: 90,
  },
  headingTwoLast: {
    color: '#F5C932',
    fontSize: 32,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: '20%',
  },
  description: {
    color: 'white',
    fontSize: 22,
    marginHorizontal: '7%',
    lineHeight: 36,
    marginTop: '20%',
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
