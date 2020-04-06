import * as React from 'react';
import { changeRegNumber, changeCarConnection, setBluetooth } from '../actions/counts.js';
import { connect } from 'react-redux';
import { Button, View, Text, SafeAreaView, Image, Dimensions, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { CustomHeader } from '../App'
import SlidingUpPanel from 'rn-sliding-up-panel';

function MyCarScreen({ navigation ,count, changeRegNumber}) {
  function pair() {

        function Bluetooth({ count, changeCarConnection, setBluetooth}) {
          let devices = ['Audi MMI 335','Beolit 15','Bose Mini Soundlink']
          return (
              <SafeAreaView style={style.background}>
                <View style={{marginTop: '15%'}}>
                  <Text style={style.headingTwoLast}>Välj din bils Bluetooth uppkoppling</Text>
              <View style= {{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text ref={c => this.text = c}
              style={style.descriptionBil}>{devices[0]}
              </Text>
                <TouchableOpacity onPress={() => {
                  changeCarConnection(true)
                  setBluetooth(devices[0])
                  console.log(count);
                  navigation.navigate('Onboarding5')
                }}
                ><Text style={style.descriptionAdd}>Lägg till ></Text>
                </TouchableOpacity>
              </View>
              <View style= {{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={style.descriptionBil}>Beolit 15
              </Text>
                <Text style={style.descriptionAdd}> Lägg till >
                </Text>
              </View>
              <View style= {{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={style.descriptionBil}>Bose Mini Soundlink
                </Text>
              <Text style={style.descriptionAdd}> Lägg till >
              </Text>
              </View>
              </View>
              <View style={{marginBottom: 20 }}>
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
        function RegNumber({changeRegNumber}) {
          const [value, setValue] = React.useState("")
              return (
                <SafeAreaView style={style.background}>
                  <View style={{marginTop: 50}}>
                  <Text style={style.headingTwoLast}>Fyll i din bils registreringsnummer
                  </Text>
                  <View  style={{flexDirection:'row', justifyContent: 'center'}}>
                  <Image
                    style={{height: Dimensions.get('screen').height * 0.07, width: Dimensions.get('screen').height * 0.04, position:'relative', top:20, borderTopLeftRadius: 10, borderBottomLeftRadius: 10}}
                    source={require('../images/sweden.png')}/>
                  <TextInput style={style.regNumInput} ref={c => this.text = c} maxLength={6}
                  style={{height:60, backgroundColor:'white', width:'70%', marginVertical:20, borderTopRightRadius: 10, borderBottomRightRadius: 10, fontSize: 45, fontWeight: 'bold', textAlign: 'center'}}
                    onChangeText={(text)=> {
                      setValue(text);
                    }} 
                  >
                  </TextInput>
                    </View>
                  </View>
              <View style={{marginBottom: 20 }}>
                  <TouchableOpacity
                    style={style.nextButton}
                    placeholder="REGNR"
                    onPress={() => {
                      changeRegNumber(value)
                      navigation.navigate('HomeApp')
                    }}
                    >
                      <Text style={style.nextButtonText} >
                        Spara och fortsätt
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

        return (
          <View>
            <View>
                <Text>För att tjänsten ska fungera så behöver du välja din bils blåtandsuppkoppling</Text>
                <Button title='Lägg till din bil' onPress={() => this._panel.show()} />
            </View>
            <SlidingUpPanel
              draggableRange={{top:Dimensions.get('screen').height * 0.80, 
              bottom:0}}
              backdropOpacity={0} 
              allowDragging = {false}
              ref={c => this._panel = c}>
              <View style={{
                backgroundColor: '#fff',
                position: 'relative',
                top: '50%',
                right: '10%',
                height: "100%",
                width: "120%",
                borderWidth: 0,
                borderColor: '#F56',
                borderRadius: 30,
                paddingVertical: 5,
                paddingHorizontal: 20
              }}>
                {count.bluetoothName === '' ? <Bluetooth /> : <RegNumber />}
              </View>
            </SlidingUpPanel>
          </View>
        )
    }
    function remove(){
      console.log(count.connectedToCar.toString())
        return (
            <View>
                <Text>Parkopplad bil</Text>
                <Text >{count.registrationNumber}</Text>
                <Text >{count.bluetoothName}</Text>
                <Button title="Ta bort" onPress={() => changeRegNumber("")}/>
            </View>
        )
    }
    return (
      <SafeAreaView style={{ flex: 1}}>
        <CustomHeader navigation={navigation}/>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {count.registrationNumber === "" ? pair() : remove() }
        </View>
      </SafeAreaView>
    );
  }
  
  function mapStateToProps (state) {
    return {
      count: state.count,
    }
  }

  const mapDispatchToProps = dispatch => ({
    changeRegNumber: regNumber => dispatch(changeRegNumber(regNumber)),
    changeCarConnection: isConnected => dispatch(changeCarConnection(isConnected)),
    setBluetooth: connection => dispatch(setBluetooth(connection)),
  })
  export default connect(
    mapStateToProps,
   mapDispatchToProps
  )(MyCarScreen)


const style = StyleSheet.create({
    heading: {
    color: '#F5C932',
    fontSize: 57,
    textAlign: 'left',
    fontWeight: '700',
    marginLeft: 28,
    marginRight: 90,
  },
    headingTwoLast:{
    color: '#F5C932',
    fontSize: 32,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: '20%',
  },
    description: {
    color: 'white',
    fontSize: 22,
    marginHorizontal:'7%',
    lineHeight: 36,
    marginTop: '20%',
  },
    descriptionBil: {
      color: 'white',
      fontSize: 22,
      marginHorizontal:'7%',
      lineHeight: 36,
      marginBottom: '5%',
  },
    descriptionAdd: {
    color: '#F5C932',
    fontSize: 22,
    marginHorizontal:'10%',
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
    regNumInput: {
    height:'20%',
    backgroundColor:'white',
    width:'80%',
    alignSelf: 'center',
    marginTop: '20%',
    borderRadius:50,
    borderColor: 'black',
    borderWidth: 2,
  }
});
