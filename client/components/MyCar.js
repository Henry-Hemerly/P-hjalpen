import * as React from 'react';
import { changeRegNumber  } from '../actions/counts.js';
import { connect } from 'react-redux';
import { Button, View, Text, SafeAreaView } from 'react-native';
import { CustomHeader } from '../App'

function MyCarScreen({ navigation ,count, changeRegNumber}) {

    function  pair(){
        return (
            <View>
                <Text>För att tjänsten ska fungera så behöver du välja din bils blåtandsuppkoppling</Text>
                <Button title="Lägg till din bil"/>
            </View>
        )
    }
    function  remove(){
        return (
            <View>
                <Text>Parkopplad bil</Text>
                <Text >{count.registrationNumber}</Text>
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