import * as React from 'react';
import { Button, View, Text, SafeAreaView, StyleSheet } from 'react-native';

function Onboarding1({ navigation }) {
    return (
      <SafeAreaView style={style.background}>
        <Text style={style.heading}>Nu är det slut på{"\n"}P-böter!</Text>
        <Text style={style.description}>Våra tester som vi utfört på bilägare i Stockholm visar att de minskade risken för att få P-böter upp till 70%.</Text>
        <Button
          title="Nästa"
          onPress={() => navigation.navigate('Onboarding2')}
        />
      </SafeAreaView>
    );
  }
  
  function Onboarding2({ navigation }) {
    return (
      <SafeAreaView style={style.background}>
        <Text style={style.heading}>Aktivera notiser</Text>
        <Text style={style.description}>Så att vi kan påminna dig...</Text>
        <Button
          title="Aktivera"
          onPress={() => navigation.navigate('Onboarding3')}
        />
        <Button
          title="Hoppa över"
          onPress={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }
  
  function Onboarding3({ navigation }) {
    return (
      <SafeAreaView style={style.background}>
        <Text style={style.heading}>Välj bil</Text>
        <Text style={style.description}>För att vi ska kunna...</Text>
        <Button
          title="Bil1"
          onPress={() => navigation.navigate('Home')}
        />
        <Button
          title="Parkoppla senare"
          onPress={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  const style = StyleSheet.create({
    heading: {
      color: '#F5C932',
      fontSize: 57,
      textAlign: 'left',
      fontWeight: '700', 
      marginLeft: 28, 
      marginRight: 90 
    },
    description: {
      color: 'white', 
      fontSize: 22, 
      marginHorizontal:28, 
      lineHeight: 36
    },
    background: {
      backgroundColor: '#001736', 
      flex: 1
    }
  });

  module.exports = {Onboarding1,Onboarding2,Onboarding3}