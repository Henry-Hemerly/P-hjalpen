import * as React from 'react';
import { connect } from 'react-redux';
import {  View, Text, SafeAreaView ,Switch, StyleSheet} from 'react-native';
import { CustomHeader } from '../App'
import { changeReminderInvalid, changeReminderPay ,changeReminderStopPay, changeReminderTime} from '../actions/counts.js';
import RNPickerSelect from 'react-native-picker-select';


function SettingsScreen({ navigation ,count, changeReminderInvalid,changeReminderPay,changeReminderStopPay,changeReminderTime}) {
    return (
      <SafeAreaView style={{ flex: 1}}>
        <CustomHeader navigation={navigation}/>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Påminnelser</Text>

        <View style={styles.view}>
            <Text>Städgata {count.reminderInvalidParking.toString()}</Text>
            <Switch value={count.reminderInvalidParking} onValueChange={(v) =>  changeReminderInvalid(v)}/>
        </View>

        <View style={styles.view}>
            <Text>Parkering ej avslutad {count.reminderStoppay.toString()}</Text>
            <Switch value={count.reminderStoppay} onValueChange={(v) =>  changeReminderStopPay(v)}/>
        </View>

        <View style={styles.view}>
            <Text>Betalningsperiod påbörjas {count.reminderTopay.toString()}</Text>
            <Switch value={count.reminderTopay} onValueChange={(v) =>  changeReminderPay(v)}/>
        </View>

        <View style={styles.view}>
            <Text>Tid för Påminnelser </Text>
            <View style={{
                        borderColor: 'grey',
                        borderBottomWidth:2,
                    }}>
                <RNPickerSelect
                    value={count.remindTime}
                    onValueChange={(v) => changeReminderTime(v)}
                    items={[
                        { label: '15', value: 15 },
                        { label: '30', value: 30 },
                        { label: '45', value: 45 },
                        { label: '60', value: 60 },
                    ]}
                />
            </View>

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
    changeReminderInvalid: isInvalidReminder => dispatch(changeReminderInvalid(isInvalidReminder)),
    changeReminderStopPay: isStopPayReminder => dispatch(changeReminderStopPay(isStopPayReminder)),
    changeReminderPay: isPayReminder => dispatch(changeReminderPay(isPayReminder)),
    changeReminderTime: timeInMin => dispatch(changeReminderTime(timeInMin))
  })
  
  export default connect(
    mapStateToProps,
   mapDispatchToProps
  )(SettingsScreen)