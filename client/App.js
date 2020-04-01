import * as React from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Onboarding1, Onboarding2 ,Onboarding3 } from './components/Onboarding';
import Home from './components/Home';


function SplashScreen({ navigation }) {
  setTimeout(() => {
    navigation.navigate('Onboarding1');
    return;
    }, 3000)

  return (
    <SafeAreaView style={{ backgroundColor: '#001736', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style= {{fontSize: 130, fontWeight: 'bold', color: 'white'}}>
      P
      </Text>
      <View style= {{backgroundColor: '#F5C932', height: 11, width: 138, marginBottom: 25}}>
      </View>
      <Text style= {{fontSize: 40, fontWeight: 'bold', color: 'white'}}>
        Hjälpen
      </Text>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="Onboarding2" component={Onboarding2} />
        <Stack.Screen name="Onboarding3" component={Onboarding3} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
