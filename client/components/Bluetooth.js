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
import {
  changeCarConnection,
  setBluetooth,
  seenOnboarding,
} from '../actions/counts.js';

function Onboarding4({
  navigation,
  count,
  changeCarConnection,
  setBluetooth,
  seenOnboarding,
}) {
  let devices = ['Audi MMI 335', 'Beolit 15', 'Bose Mini Sound'];
  return (
    <SafeAreaView style={style.background}>
      <View>
        <Text style={style.headingTwoLast}>
          Välj din bils Bluetooth uppkoppling
        </Text>
        {devices.map((dev, index) => (
          <View key={index} style={style.rows}>
            <Text ref={c => (this.text = c)} style={style.descriptionBil}>
              {dev}
            </Text>
            <TouchableOpacity
              onPress={() => {
                changeCarConnection(true);
                seenOnboarding(true);
                setBluetooth(dev);
                navigation.navigate('Onboarding5');
              }}>
              <Text style={style.descriptionAdd}>Lägg till ></Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View>
        <TouchableOpacity
          style={style.nextButton}
          onPress={() => navigation.navigate('Onboarding5')}>
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
  headingTwoLast: {
    color: '#F5C932',
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: '20%',
    marginTop: '15%',
  },
  rows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  descriptionBil: {
    color: 'white',
    fontSize: Dimensions.get('screen').height * 0.030,
    marginHorizontal: '7%',
    lineHeight: 36,
    marginBottom: '5%',
  },
  descriptionAdd: {
    color: '#F5C932',
    fontSize: Dimensions.get('screen').height * 0.030,
    marginHorizontal: '10%',
    lineHeight: 36,
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
});
function mapStateToProps(state) {
  return {
    count: state.count,
  };
}
const mapDispatchToProps = dispatch => ({
  changeCarConnection: isConnected =>
    dispatch(changeCarConnection(isConnected)),
  setBluetooth: connection => dispatch(setBluetooth(connection)),
  seenOnboarding: hasSeenOnboarding =>
    dispatch(seenOnboarding(hasSeenOnboarding)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Onboarding4);
