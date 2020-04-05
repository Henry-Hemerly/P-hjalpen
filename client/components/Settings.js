import * as React from 'react';
import { connect } from 'react-redux';
import { Button, View, Text, SafeAreaView ,Switch, StyleSheet} from 'react-native';
import { CustomHeader } from '../App'
import { changeReminderInvalid, changeReminderPay ,changeReminderStopPay} from '../actions/counts.js';


function SettingsScreen({ navigation ,count, changeReminderInvalid,changeReminderPay,changeReminderStopPay}) {
    return (
      <SafeAreaView style={{ flex: 1}}>
        <CustomHeader navigation={navigation}/>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Påminnelser</Text>

        <View style={styles.view}>
        <Text>Städgata {count.reminderInvalidParking.toString()}</Text>
        <Switch></Switch>
        </View>

        <View style={styles.view}>
    <Text>Parkering ej avslutad {count.reminderStoppay.toString()}</Text>
        <Switch></Switch>
        </View>

        <View style={styles.view}>
    <Text>Betalningsperiod påbörjas {count.reminderTopay.toString()}</Text>
        <Switch></Switch>
        </View>

        <View style={styles.view}>
        <Text>När vill du bli påmind</Text>
        <Button title="Ändra"/>
        </View>

        </View>
      </SafeAreaView>
    );
  }
  const styles = StyleSheet.create({
    view: {
        flexDirection:'row'
    }
  });

  function mapStateToProps (state) {
    return {
      count: state.count,
    }
  }
  const mapDispatchToProps = dispatch => ({
    changeRegNumber: isInvalidReminder => dispatch(changeRegNumber(isInvalidReminder)),
    changeRegNumber: isStopPayReminder => dispatch(changeRegNumber(isStopPayReminder)),
    changeRegNumber: isPayReminder => dispatch(changeRegNumber(isPayReminder))
  })
  
  export default connect(
    mapStateToProps,
   mapDispatchToProps
  )(SettingsScreen)