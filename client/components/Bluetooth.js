import * as React from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { changeCarConnection, setBluetooth } from '../actions/counts.js';


function Onboarding4({ navigation, count, changeCarConnection, setBluetooth }) {
  let devices = ['Audi MMI 335', 'Beolit 15', 'Bose Mini Sound']
  return (
    <SafeAreaView style={style.background}>
      <View style={{ marginTop: '15%' }}>
        <Text style={style.headingTwoLast}>Välj din bils Bluetooth uppkoppling</Text>
        {devices.map((dev, index) => (
          <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text ref={c => this.text = c}
              style={style.descriptionBil}>{dev}
            </Text>
            <TouchableOpacity onPress={() => {
              changeCarConnection(true)
              setBluetooth(dev)
              console.log(count);
              navigation.navigate('Onboarding5')
            }}
            ><Text style={style.descriptionAdd}>Lägg till ></Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={{ marginBottom: 20 }}>
        <TouchableOpacity
          style={style.nextButton}
          onPress={() => navigation.navigate('Onboarding5')}>
          <Text style={style.nextButtonText} >
            Nästa
    </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeApp')}
        >
          <Text style={style.skipButton}>
            Hoppa över
    </Text>
        </TouchableOpacity>
      </View>
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
  },
  descriptionBil: {
    color: 'white',
    fontSize: 22,
    marginHorizontal: '7%',
    lineHeight: 36,
    marginBottom: '5%',
  },
  descriptionAdd: {
    color: '#F5C932',
    fontSize: 22,
    marginHorizontal: '10%',
    lineHeight: 36,
  },
  background: {
    backgroundColor: '#001736',
    flex: 1,
    justifyContent: "space-between"
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
    marginTop: 22
  },
});
function mapStateToProps(state) {
  return {
    count: state.count,
  }
}
const mapDispatchToProps = dispatch => ({
  changeCarConnection: isConnected => dispatch(changeCarConnection(isConnected)),
  setBluetooth: connection => dispatch(setBluetooth(connection)),
})

export default connect(
  mapStateToProps, mapDispatchToProps
)(Onboarding4)


