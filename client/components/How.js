import * as React from 'react';
import {View, Text, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {CustomHeader} from '../App';

function HowScreen({navigation}) {
  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
        <CustomHeader navigation={navigation} />
        <Text style={style.heading}>Hur fungerar det?</Text>
        <View style={style.border} />
        <Text style={style.subHeading}>När blir jag påmind?</Text>
        <Text style={style.text}>
          Under “Inställningar” väljer du vilka typer av påminnelser du vill få
          samt hur långt innan du vill att påminnelsen ska skickas.{'\n'}
          {'\n'}
          Det finns tre olika händelser vi använder för att skicka påminnelser.
          {'\n'}
          {'\n'}
          1. Städgata - Om du står parkerad på en gata som snart ska städas
          eller där det snart så påminner vi dig att det är dags att flytta på
          bilen.{'\n'}
          {'\n'}
          2. När du kör iväg med din bil så påminner vi dig om att avsluta en
          pågående betalning.{'\n'}
          {'\n'}
          3. Om du står parkerad på en plats där en avgift snart börjar gälla.
        </Text>
        <Text style={style.subHeading}>
          Hur vet P-Hjälpen att jag parkerat/åker iväg med min bil?
        </Text>
        <Text style={style.text}>
          För att P-Hjälpen ska fungera automatiskt så måste din bil vara
          utrustad med bluetooth samt parkopplad under Inställningar/Min bil. Om
          din bil inte har bluetooth går det bra att markera platsen som din bil
          står parkerad på manuellt.{'\n'}
          {'\n'}
          <Text style={style.textItalic}>
            OBS: funktionen “Parkering avslutad” fungerar bara om din bil har
            bluetooth.
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 35,
    fontWeight: '700',
    letterSpacing: 0.75,
    marginHorizontal: 25,
    marginTop: 30,
    marginBottom: 20,
    color: '#1E2657',
  },
  border: {
    borderColor: '#1E2657',
    borderWidth: 1,
    opacity: 0.05,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 50,
    marginLeft: 25,
    color: '#1E2657',
    letterSpacing: 0.5,
    marginBottom: 25,
  },
  text: {
    marginHorizontal: 25,
    color: '#1E2657',
    fontSize: 18,
    lineHeight: 26,
  },
  textItalic: {
    marginHorizontal: 25,
    color: '#1E2657',
    fontSize: 18,
    lineHeight: 26,
    fontStyle: 'italic',
  },
});
export default HowScreen;
