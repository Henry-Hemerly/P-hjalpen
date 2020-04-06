import * as React from 'react';
import {  View, Text, SafeAreaView } from 'react-native';
import { CustomHeader } from '../App'

function ContacsScreen({ navigation }) {
    return (
      <SafeAreaView style={{ flex: 1}}>
        <CustomHeader navigation={navigation}/>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Hur fungerar det?</Text>
        </View>
      </SafeAreaView>
    );
  }
  export default ContacsScreen