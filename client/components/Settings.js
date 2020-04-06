import * as React from 'react';
import { connect } from 'react-redux';
import { View, Text, SafeAreaView, Switch, StyleSheet } from 'react-native';
import { CustomHeader } from '../App'
import { changeReminderInvalid, changeReminderPay, changeReminderStopPay, changeReminderTime } from '../actions/counts.js';
import RNPickerSelect from 'react-native-picker-select';


function SettingsScreen({ navigation, count, changeReminderInvalid, changeReminderPay, changeReminderStopPay, changeReminderTime }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader navigation={navigation} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 35, fontWeight: '700', letterSpacing: 0.75, marginHorizontal: 25, marginTop: 30, marginBottom: 20, color: '#1E2657' }}>Inställningar</Text>
        <View style={{ borderColor: '#1E2657', borderWidth: 1, opacity: 0.05 }}></View>
        <Text style={{ fontSize: 14, fontWeight: '700', marginTop: 50, marginLeft: 25, color: '#4878D3', letterSpacing: 1.5, marginBottom: 20, marginBottom: 25 }}>PÅMINNELSER</Text>
        <View style={styles.view}>
          <Text style={{ fontSize: 20, color: '#1E2657', fontWeight: '500' }}>Städgata {count.reminderInvalidParking.toString()}</Text>
          <Switch value={count.reminderInvalidParking} onValueChange={(v) => changeReminderInvalid(v)} />
        </View>
        <View>
          <Text style={{ marginLeft: 25, marginRight: 100, marginBottom: 30, color: '#767C9F', fontSize: 14, lineHeight: 21 }}>Vi påminner dig när du står parkerad på en plats där du inte längre får stå t.ex. städgata.</Text>
        </View>
        <View style={styles.view}>
          <Text style={{ fontSize: 20, color: '#1E2657', fontWeight: '500' }}>Parkering ej avslutad</Text>
          <Switch value={count.reminderStoppay} onValueChange={(v) => changeReminderStopPay(v)} />
        </View>
        <View>
          <Text style={{ marginLeft: 25, marginRight: 100, marginBottom: 30, color: '#767C9F', fontSize: 14, lineHeight: 21 }}>Vi har all glömt det någon gång. Vi påminner dig att avsluta en pågående betalning om du skulle glömma.</Text>
        </View>
        <View style={styles.view}>
          <Text style={{ fontSize: 20, color: '#1E2657', fontWeight: '500' }}>Betalningsperiod påbörjas</Text>
          <Switch value={count.reminderTopay} onValueChange={(v) => changeReminderPay(v)} />
        </View>
        <View>
          <Text style={{ marginLeft: 25, marginRight: 100, marginBottom: 30, color: '#767C9F', fontSize: 14, lineHeight: 21 }}>Om du står parkerad på en plats där en avgift snart börjar gälla.</Text>
        </View>
        <View style={styles.view}>
          <Text style={{ fontSize: 20, color: '#1E2657', fontWeight: '500' }}>Tid för Påminnelser </Text>
          <View style={{
            borderColor: 'grey',
            borderBottomWidth: 2,
            marginRight: 15,
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
    justifyContent: "space-between",
    marginHorizontal: 25,
    flexDirection: 'row'
  }
});

function mapStateToProps(state) {
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
