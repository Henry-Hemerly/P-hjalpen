import * as React from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

  ////////// New pages in onboarding

function Onboarding1({ navigation }) {
    return (
      <SafeAreaView style={style.background}>
        <Text style={style.heading}>Nu är det slut på{"\n"}P-böter!</Text>
        <Text style={style.description}>Våra tester som vi utfört på bilägare i Stockholm visar att de minskade risken för att få P-böter upp till 70%.</Text>
        <TouchableOpacity
          style={style.nextButton}
          onPress={() => navigation.navigate('Onboarding2')}>
            <Text style={style.nextButtonText} >
              Nästa
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeApp')}
        >
          <Text style={style.skipButton}>
            Hoppa över
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  function Onboarding2({ navigation }) {
    return (
      <SafeAreaView style={style.background}>
        <Text style={style.heading}>Glömt städgata igen?</Text>
        <Text style={style.description}>P-hjälpen glömmer inte när det är dags att flytta på bilen. Välj när du vill bli påmind.</Text>
        <TouchableOpacity
          style={style.nextButton}
          onPress={() => navigation.navigate('Onboarding3')}>
            <Text style={style.nextButtonText}>
              Nästa
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeApp')}
        >
          <Text style={style.skipButton}>
            Hoppa över
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };
  
  function Onboarding3({ navigation }) {
    return (
      <SafeAreaView style={style.background}>
        <Text style={style.heading}>P-hjälpen påminner dig när det är dags!
        </Text>
        <Text style={style.description}>P-hjälpen är skapad av bilägare för bilägare i syfte spara dina pengar till något vettigare.
        </Text>
        <TouchableOpacity
          style={style.nextButton}
          onPress={() => navigation.navigate('HomeApp')}>
            <Text style={style.nextButtonText} >
              Nästa
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeApp')}
        >
          <Text style={style.skipButton}>
            Hoppa över
          </Text>
        </TouchableOpacity>
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
  },
  nextButton: {
    alignSelf: 'stretch',
    backgroundColor: '#F5C932',
    borderRadius: 34,
    borderWidth: 1,
    marginHorizontal: 22,
    height: 68
    },
  nextButtonText: {
    alignSelf: 'center',
    paddingVertical: 21,
    fontSize: 22,
    color: '#1E2657'
  },
  skipButton: {
    color: '#fff',
    fontSize: 16,
    alignSelf: 'center',
    lineHeight: 30,
    marginTop: 22
  }
});

module.exports = {Onboarding1,Onboarding2,Onboarding3}