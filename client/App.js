/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React ,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Onboarding from 'react-native-onboarding-swiper';

export default function App() {
  return (
    <>
    <Onboarding
      onDone={()=> startPage()}
      pages={[
      {
        backgroundColor: '#fff',
        image: <Image source={require('./images/circle.png')} />,
        title: 'Onboarding',
        subtitle: 'Done with React Native Onboarding Swiper',
      },
      {
        backgroundColor: '#fff',
        image: <Image source={require('./images/circle.png')} />,
        title: '2nd page',
        subtitle: 'Done with React Native Onboarding Swiper',
      }
    ]}
  />
</>
  )
}
function startPage() {
  console.log('pooop');
  
  return <Text>Poop</Text>
}



const styles = StyleSheet.create({

});
