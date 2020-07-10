import * as React from 'react';
import {
  changeRegNumber,
  changeCarConnection,
  setBluetooth,
} from '../actions/counts.js';
import {connect} from 'react-redux';
import {
  Button,
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {CustomHeader} from '../App';
import SlidingUpPanel from 'rn-sliding-up-panel';

function MyCarScreen({
  navigation,
  count,
  changeRegNumber,
  changeCarConnection,
  setBluetooth,
}) {
  function pair() {
    function Bluetooth() {
      let devices = ['Audi MMI 335', 'Beolit 15', 'Bose Mini Soundlink'];
      return (
        <SafeAreaView style={style.background}>
          <View>
            <Text style={style.heading}>Välj din bil</Text>
            <View style={style.line} />
            {devices.map((dev, index) => (
              <View key={index} style={style.rows}>
                <Text ref={c => (this.text = c)} style={style.descriptionBil}>
                  {dev}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    changeCarConnection(true);
                    setBluetooth(dev);
                  }}>
                  <Text style={style.descriptionAdd}>Lägg till</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </SafeAreaView>
      );
    }
    function RegNumber() {
      const [value, setValue] = React.useState('');
      return (
        <SafeAreaView style={style.background}>
          <KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
            <ScrollView style={style.panelWrapper}>
              <Text style={style.heading}>Ange reg-nummer</Text>
              <View style={style.line} />
              <View style={style.licensePlateWrapper}>
                <Image
                  style={style.image}
                  source={require('../images/sweden.png')}
                />
                <TextInput
                  style={style.regNumInput}
                  ref={c => (this.text = c)}
                  maxLength={6}
                  onChangeText={text => {
                    setValue(text);
                  }}
                />
              </View>
            </ScrollView>
            <View>
              <TouchableOpacity
                style={style.nextButton}
                onPress={() => {
                  changeRegNumber(value);
                  navigation.navigate('HomeApp');
                }}>
                <Text style={style.nextButtonText}>Spara och fortsätt</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('HomeApp')}>
                <Text style={style.skipButton}>Hoppa över</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }

    return (
      <View>
        <View>
          <Image
            style={style.icon}
            source={require('../images/my_car3x.png')}
          />
          <Text style={style.text}>
            För att den här tjänsten ska fungera så behöver du välja din bils
            blåtandsuppkoppling.
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={style.parkingButton}
            title="Lägg till din bil"
            onPress={() => this._panel.show()}>
            <Text style={style.parkingButtonText}>Lägg till din bil</Text>
          </TouchableOpacity>
        </View>
        <SlidingUpPanel
          draggableRange={{
            top: Dimensions.get('screen').height * 0.8,
            bottom: 0,
          }}
          backdropOpacity={0}
          allowDragging={false}
          ref={c => (this._panel = c)}>
          <View style={style.slide}>
            {count.bluetoothName == '' ? <Bluetooth /> : <RegNumber />}
          </View>
        </SlidingUpPanel>
      </View>
    );
  }
  function remove() {
    return (
      <View style={{flex: 1, alignItems: 'flex-start'}}>
        <Text style={style.removeText}>PARKOPPLAD BIL</Text>
        <View style={style.removeView}>
          <Text style={style.removeSmall}>
            {count.registrationNumber.toUpperCase()}
          </Text>
          <View style={style.removeBtnWrapper}>
            <Button
              title="Ta bort"
              onPress={() => {
                changeRegNumber('');
                setBluetooth('');
              }}
            />
          </View>
        </View>
        <Text style={style.btName}>{count.bluetoothName}</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={style.flexOne}>
      <CustomHeader navigation={navigation} />
      <Text style={style.headingTwoLast}>Min bil</Text>
      <View style={style.border} />
      <View style={style.flexOne}>
        {count.registrationNumber === '' ? pair() : remove()}
      </View>
    </SafeAreaView>
  );
}

function mapStateToProps(state) {
  return {
    count: state.count,
  };
}

const mapDispatchToProps = dispatch => ({
  changeRegNumber: regNumber => dispatch(changeRegNumber(regNumber)),
  changeCarConnection: isConnected =>
    dispatch(changeCarConnection(isConnected)),
  setBluetooth: connection => dispatch(setBluetooth(connection)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyCarScreen);

const style = StyleSheet.create({
  panelWrapper: {
    marginTop: '5%',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.75,
    marginHorizontal: 25,
    marginTop: 1,
    marginBottom: 20,
    color: '#1E2657',
    marginTop: '5%',
  },
  border: {
    borderColor: '#1E2657',
    borderWidth: 1,
    opacity: 0.05,
  },
  flexOne: {
    flex: 1,
  },
  rows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    borderColor: '#1E2657',
    borderWidth: 1,
    opacity: 0.05,
    marginBottom: 30,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 25,
    marginTop: '25%',
  },
  licensePlateWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    height: 61,
    width: 32,
    position: 'relative',
    top: 19,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1E2657',
    marginLeft: 25,
    marginRight: 25,
    textAlign: 'center',
    lineHeight: 30,
  },
  removeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4878D3',
    letterSpacing: 1.5,
    marginBottom: 20,
    marginBottom: 25,
    marginHorizontal: 25,
    marginTop: 50,
  },
  removeView: {
    flexDirection: 'row',
    marginLeft: 25,
    justifyContent: 'space-between',
    width: '90%',
    alignContent: 'center',
  },
  removeSmall: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#1E2657',
  },
  removeBtnWrapper: {
    paddingTop: '2%',
  },
  btName: {
    marginHorizontal: 25,
    color: '#767C9F',
    fontSize: 14,
  },
  headingTwoLast: {
    fontSize: 35,
    fontWeight: '700',
    letterSpacing: 0.75,
    marginHorizontal: 25,
    marginTop: 30,
    marginBottom: 20,
    color: '#1E2657',
  },
  descriptionBil: {
    color: '#1E2657',
    fontSize: 20,
    marginHorizontal: '7%',
    lineHeight: 36,
    marginBottom: '5%',
    fontWeight: '500',
  },
  descriptionAdd: {
    color: 'steelblue',
    fontSize: 20,
    marginHorizontal: '5%',
    lineHeight: 36,
  },
  background: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nextButton: {
    alignSelf: 'stretch',
    backgroundColor: '#1E2657',
    borderRadius: 34,
    borderWidth: 1,
    marginHorizontal: 22,
    height: Dimensions.get('screen').height * 0.075,
    position: 'relative',
    bottom: Dimensions.get('screen').height * 0.3,
  },
  nextButtonText: {
    alignSelf: 'center',
    position: 'absolute',
    top: '25%',
    color: '#F5C932',
    fontSize: Dimensions.get('screen').height * 0.03,
  },
  skipButton: {
    color: 'steelblue',
    fontSize: Dimensions.get('screen').height * 0.025,
    alignSelf: 'center',
    lineHeight: 30,
    marginTop: 22,
    position: 'relative',
    bottom: Dimensions.get('screen').height * 0.32,
  },
  regNumInput: {
    height: 60,
    backgroundColor: 'white',
    width: '70%',
    marginVertical: 20,
    borderColor: 'black',
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  slide: {
    backgroundColor: '#fff',
    position: 'relative',
    top: '31%',
    height: '100%',
    width: '100%',
    borderWidth: 0,
    borderColor: '#F56',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 5,
  },
  parkingButton: {
    alignSelf: 'stretch',
    backgroundColor: '#001E39',
    borderRadius: 34,
    borderWidth: 1,
    marginHorizontal: '10%',
    height: Dimensions.get('screen').height * 0.075,
    width: '80%',
    justifyContent: 'center',
    marginTop: 30,
  },
  parkingButtonText: {
    alignSelf: 'center',
    fontSize: Dimensions.get('screen').height * 0.03,
    color: '#F5C932',
    fontWeight: '500',
  },
});
