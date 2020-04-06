import * as React from 'react';
import { changeRegNumber  } from '../actions/counts.js';
import { connect } from 'react-redux';
import { Button, View, Text, SafeAreaView, Dimensions } from 'react-native';
import { CustomHeader } from '../App'
import SlidingUpPanel from 'rn-sliding-up-panel';
function MyCarScreen({ navigation ,count, changeRegNumber}) {
    function  pair() {
        function Bluetooth() {
          return (
            <Button onPress={() => {  }} title='Spara och gå till nästa' /> // Save car connection
          )
        }
        function RegNumber() {
          return (
            <Button title='Spara och stäng' onPress={() => this._panel.hide()} /> // Save reg number and hide the panel
          )
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
                <RegNumber />
              </View>
            </SlidingUpPanel>
          </View>
        )
    }
    function  remove(){
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
  })
  export default connect(
    mapStateToProps,
   mapDispatchToProps
  )(MyCarScreen)