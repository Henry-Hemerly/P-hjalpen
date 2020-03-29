import * as React from 'react';
import { Button, View, Text, SafeAreaView } from 'react-native';

function Onboarding1({ navigation }) {
    return (
      <SafeAreaView style={{ backgroundColor: '#fff', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Inga fler P-böter</Text>
        <Text>Vi påminner dig...</Text>
        <Button
          title="Nästa"
          onPress={() => navigation.navigate('Onboarding2')}
        />
      </SafeAreaView>
    );
  }
  
  function Onboarding2({ navigation }) {
    return (
      <View style={{ backgroundColor: '#fff', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Aktivera notiser</Text>
        <Text>Så att vi kan påminna dig...</Text>
        <Button
          title="Aktivera"
          onPress={() => navigation.navigate('Onboarding3')}
        />
        <Button
          title="Hoppa över"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    );
  }
  
  function Onboarding3({ navigation }) {
    return (
      <View style={{ backgroundColor: '#fff', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Välj bil</Text>
        <Text>För att vi ska kunna...</Text>
        <Button
          title="Bil1"
          onPress={() => navigation.navigate('Home')}
        />
        <Button
          title="Parkoppla senare"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    );
  }

  module.exports = {Onboarding1,Onboarding2,Onboarding3}