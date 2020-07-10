import * as React from 'react';
import {Text, View, Dimensions, Image, StyleSheet} from 'react-native';
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
import {absoluteFill} from 'react-native-extended-stylesheet';

export function CustomHeader({isHome, navigation}) {
  return (
    <View style={style.headerContainer}>
      <View style={style.BackButtonContainer}>
        {isHome ? null : (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('./images/arrow.png')}
              style={style.arrowIcon}
            />
          </TouchableOpacity>
        )}
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
    <SafeAreaView style={style.drawerNavContainer}>
      <View style={style.contentWrapper}>
        <View style={style.menuItemWrapper}>
          <Image
            source={require('./images/settings2x.png')}
            style={style.icon}
          />
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Settings')}>
            <Text style={style.listItemSettings}>Inställningar</Text>
          </TouchableOpacity>
        </View>
        <View style={style.menuItemWrapper}>
          <Image source={require('./images/my_car2x.png')} style={style.icon} />
          <TouchableOpacity onPress={() => props.navigation.navigate('MyCar')}>
            <Text style={style.listItemMyCar}>Min bil</Text>
          </TouchableOpacity>
        </View>
        <View style={style.menuItemWrapper}>
          <Image
            source={require('./images/how_does_it_work2x.png')}
            style={style.icon}
          />
          <TouchableOpacity onPress={() => props.navigation.navigate('How')}>
            <Text style={style.listItemHow}>Hur fungerar det?</Text>
          </TouchableOpacity>
        </View>
        <View style={style.menuItemWrapper}>
          <Image
            source={require('./images/contact2x.png')}
            style={style.icon}
          />
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Contacts')}>
            <Text style={style.listItemContact}>Kontakt</Text>
          </TouchableOpacity>
        </View>
        <View style={style.lowerPartWrapper}>
          <Image source={require('./images/logo2x.png')} style={style.logo} />
          <Text style={style.text}>
            P-hjälpen är skapad av bilägare för bilägare i syfte att spara dina
            pengar till något vettigare.
          </Text>
          <Text style={style.version}>v. 1.0.1</Text>
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

const style = StyleSheet.create({
  splashContainer: {
    backgroundColor: '#001736',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBigP: {
    fontSize: 130,
    fontWeight: 'bold',
    color: 'white',
  },
  logoBorder: {
    backgroundColor: '#F5C932',
    height: 11,
    width: 138,
    marginBottom: 25,
  },
  logoHjalpen: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    height: 50,
  },
  BackButtonContainer: {
    flex: 1,
  },
  arrowIcon: {
    height: 40,
    width: 35,
    resizeMode: 'center',
    left: 25,
    top: 10,
  },
  drawerNavContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentWrapper: {
    marginLeft: '10%',
    top: '20%',
  },
  menuItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    resizeMode: 'contain',
    width: '10%',
  },
  listItemSettings: {
    fontSize: Dimensions.get('screen').height * 0.02,
    fontWeight: '500',
    marginBottom: '5%',
    color: '#001E39',
    marginLeft: '15%',
    paddingTop: '5%',
  },
  listItemMyCar: {
    fontSize: Dimensions.get('screen').height * 0.02,
    fontWeight: '500',
    marginBottom: '5%',
    color: '#001E39',
    marginLeft: '20%',
    paddingTop: '5%',
  },
  listItemHow: {
    fontSize: Dimensions.get('screen').height * 0.02,
    fontWeight: '500',
    marginBottom: '5%',
    color: '#001E39',
    marginLeft: '12%',
    paddingTop: '5%',
  },
  listItemContact: {
    fontSize: Dimensions.get('screen').height * 0.02,
    fontWeight: '500',
    marginBottom: '5%',
    color: '#001E39',
    marginLeft: '19%',
    paddingTop: '1,5%',
  },
  lowerPartWrapper: {
    position: 'relative',
    marginRight: '17%',
    top: Dimensions.get('screen').height * 0.1,
    alignContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    resizeMode: 'center',
  },
  text: {
    textAlign: 'center',
    lineHeight: 21,
    color: '#767C9F',
    marginTop: '1%',
  },
  version: {
    textAlign: 'center',
    marginTop: '4%',
    lineHeight: 21,
    color: '#767C9F',
  },
});
export default connect()(App);
