import * as React from 'react';
import {Text, View, Dimensions, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Onboarding1 from './components/Onboarding1';
import Onboarding2 from './components/Onboarding2';
import Onboarding3 from './components/Onboarding3';
import Onboarding4 from './components/Bluetooth';
import Onboarding5 from './components/Onboarding';
import HomeScreen from './components/Home';
import MyCarScreen from './components/MyCar';
import SettingsScreen from './components/Settings';
import HowScreen from './components/How';
import ContactsScreen from './components/Contacts';
import SplashScreen from './components/SplashScreen';
import {connect} from 'react-redux';

export function CustomHeader({isHome, navigation}) {
  return (
    <View style={{flexDirection: 'row', height: 50}}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        {isHome ? null : (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('./images/arrow.png')}
              style={{
                height: 40,
                width: 35,
                resizeMode: 'center',
                left: 25,
                top: 10,
              }}
            />
          </TouchableOpacity>
        )}
        <View
          style={{flex: 1.5, justifyContent: 'center', alignItems: 'center'}}
        />
        <View
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        />
      </View>
    </View>
  );
}
const navOptionHandler = () => ({
  headerShown: false,
});
const StackHome = createStackNavigator();
function HomeStack() {
  return (
    <StackHome.Navigator initialRouteName="Home">
      <StackHome.Screen
        name="Home"
        component={HomeScreen}
        options={navOptionHandler}
      />
    </StackHome.Navigator>
  );
}
// DRAWER NAVIGATION
const Drawer = createDrawerNavigator();
function CutomDrawerContent(props) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'white',
      }}>
      <View style={{marginLeft: '10%', top: '20%'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('./images/settings2x.png')}
            style={{resizeMode: 'contain', width: '10%'}}
          />
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Settings')}>
            <Text
              style={{
                fontSize: Dimensions.get('screen').height * 0.02,
                fontWeight: '500',
                marginBottom: '5%',
                color: '#001E39',
                marginLeft: '15%',
                paddingTop: '5%',
              }}>
              Inställningar
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('./images/my_car2x.png')}
            style={{resizeMode: 'contain', width: '10%'}}
          />
          <TouchableOpacity onPress={() => props.navigation.navigate('MyCar')}>
            <Text
              style={{
                fontSize: Dimensions.get('screen').height * 0.02,
                fontWeight: '500',
                marginBottom: '5%',
                color: '#001E39',
                marginLeft: '20%',
                paddingTop: '5%',
              }}>
              Min bil
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('./images/how_does_it_work2x.png')}
            style={{resizeMode: 'contain', width: '10%'}}
          />
          <TouchableOpacity onPress={() => props.navigation.navigate('How')}>
            <Text
              style={{
                fontSize: Dimensions.get('screen').height * 0.02,
                fontWeight: '500',
                marginBottom: '5%',
                color: '#001E39',
                marginLeft: '12%',
                paddingTop: '5%',
              }}>
              Hur fungerar det?
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('./images/contact2x.png')}
            style={{resizeMode: 'contain', width: '10%'}}
          />
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Contacts')}>
            <Text
              style={{
                fontSize: Dimensions.get('screen').height * 0.02,
                fontWeight: '500',
                marginBottom: '5%',
                color: '#001E39',
                marginLeft: '20%',
              }}>
              Kontakt
            </Text>
          </TouchableOpacity>
        </View>
        <View />
        <View
          style={{
            marginRight: '17%',
            marginTop: '60%',
            alignContent: 'center',
          }}>
          <Image
            source={require('./images/logo2x.png')}
            style={{alignSelf: 'center', resizeMode: 'center'}}
          />
          <Text style={{textAlign: 'center', lineHeight: 21, color: '#767C9F'}}>
            P-hjälpen är skapad av bilägare för bilägare i syfte att spara dina
            pengar till något vettigare.
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginTop: '10%',
              lineHeight: 21,
              color: '#767C9F',
            }}>
            v. 1.0.1
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerStyle={{
        width: '80%',
      }}
      initialRouteName="Home"
      drawerContent={props => CutomDrawerContent(props)}
      hideStatusBar>
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="How" component={HowScreen} />
      <Drawer.Screen name="Contacts" component={ContactsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="MyCar" component={MyCarScreen} />
    </Drawer.Navigator>
  );
}
// ONBOARDING NAVIGATION
const StackApp = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <StackApp.Navigator initialRouteName="SplashScreen">
        <StackApp.Screen
          name="HomeApp"
          component={DrawerNavigator}
          options={navOptionHandler}
        />
        <StackApp.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={navOptionHandler}
        />
        <StackApp.Screen
          name="Onboarding1"
          component={Onboarding1}
          options={navOptionHandler}
        />
        <StackApp.Screen
          name="Onboarding2"
          component={Onboarding2}
          options={navOptionHandler}
        />
        <StackApp.Screen
          name="Onboarding3"
          component={Onboarding3}
          options={navOptionHandler}
        />
        <StackApp.Screen
          name="Onboarding4"
          component={Onboarding4}
          options={navOptionHandler}
        />
        <StackApp.Screen
          name="Onboarding5"
          component={Onboarding5}
          options={navOptionHandler}
        />
      </StackApp.Navigator>
    </NavigationContainer>
  );
}
export default connect()(App);
