import * as React from 'react';
import { Text, View , ScrollView, Button, Dimensions, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {  SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Onboarding1, Onboarding2 ,Onboarding3, Onboarding4 } from './components/Onboarding';
import Onboarding5 from './components/Onboarding';
import HomeScreen from './components/Home';
import MyCarScreen from './components/MyCar';
import SettingsScreen from './components/Settings';
var PushNotification = require("react-native-push-notification");
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { connect } from 'react-redux';
PushNotification.configure({
  // (optional) Called when Token is generated 
  onRegister: function(token) {
    console.log("TOKEN:", token);
  },
  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log("NOTIFICATION:", notification);
    // process the notification
    // required on iOS only 
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  // IOS ONLY 
  permissions: {
    alert: true,
    badge: true,
    sound: true
  },
  // Should the initial notification be popped automatically
  popInitialNotification: true,
  requestPermissions: true
});
function sendNotification() {
  PushNotification.localNotification({
    title: "My Notification Title", // (optional)
    message: "My Notification Message", // (required)
  });
}
function sendScheduledNotification() {
  PushNotification.localNotificationSchedule({
    title: "My Notification Title", // (optional)
    message: "My Notification Message", // (required)
    date: new Date(Date.now() + 10 * 1000) // in 60 secs
  });
}
function NotificationsScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1}}>
      <CustomHeader navigation={navigation}/>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications screen</Text>
      <Button title="Send notification!" onPress={()=> sendScheduledNotification()}/>
      </View>
    </SafeAreaView>
  );
}
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
export function CustomHeader({isHome, navigation}) {
  return (
    <View style={{ flexDirection: 'row', height:50 }}>
      <View style={{ flex: 1, justifyContent: 'center'}}>
     {
       isHome ? 
          null
      : <TouchableOpacity 
      onPress={()=> navigation.goBack()}
      style={{ flexDirection: 'row', height:50 }}>
        <Text>Back</Text>
        </TouchableOpacity>
     } 
    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
      </View>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    </View>
    </View>
    </View>
  );
}
const navOptionHandler = () => ({
  headerShown: false
})
const StackHome = createStackNavigator();
function HomeStack() {
  return (
      <StackHome.Navigator initialRouteName="Home">
        <StackHome.Screen name="Home" component={HomeScreen} options={navOptionHandler} />
      </StackHome.Navigator>
  );
}
// DRAWER NAVIGATION
const Drawer = createDrawerNavigator();
function CutomDrawerContent(props) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-between", backgroundColor:'white'}}>
      <View style = {{marginLeft: '10%', top: '20%' }}>
      <View style= {{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={require('./images/settings2x.png')} style = {{resizeMode: "contain", width:'10%'}} />
        <TouchableOpacity onPress={()=> props.navigation.navigate('Settings')}>
          <Text style={{ 
            fontSize: Dimensions.get('screen').height * 0.02, fontWeight: '500', marginBottom: '5%',
            color: '#001E39', marginLeft: '15%', paddingTop:'5%'}}>Inställningar
          </Text>
        </TouchableOpacity>
      </View>
    <View style= {{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={require('./images/my_car2x.png')} style = {{resizeMode: "contain", width:'10%'}} />
        <TouchableOpacity onPress={()=> props.navigation.navigate('MyCar')}>
          <Text style={{ 
            fontSize: Dimensions.get('screen').height * 0.02, fontWeight: '500', marginBottom: '5%',
            color: '#001E39', marginLeft: '20%', paddingTop:'5%'}}>Min bil
          </Text>
      </TouchableOpacity>
      </View>
      <View style= {{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={require('./images/how_does_it_work2x.png')} style = {{resizeMode: "contain", width:'10%'}} />
        <TouchableOpacity onPress={()=> props.navigation.navigate('How')}>
          <Text style={{ 
            fontSize: Dimensions.get('screen').height * 0.02, fontWeight: '500', marginBottom: '5%',
            color: '#001E39', marginLeft: '12%', paddingTop:'5%'}}>Hur fungerar det?
          </Text>
      </TouchableOpacity>
      </View>
      <View style= {{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={require('./images/contact2x.png')} style = {{resizeMode: "contain", width:'10%'}} />
        <TouchableOpacity onPress={()=> props.navigation.navigate('Contacts')}>
          <Text style={{ 
            fontSize: Dimensions.get('screen').height * 0.02, fontWeight: '500', marginBottom: '5%',
            color: '#001E39', marginLeft: '20%'}}>Kontakt
          </Text>
      </TouchableOpacity>
      </View>
      <View></View>
      <View style={{marginRight:'17%', marginTop: '60%', alignContent: "center"}}>
      <Image source={require('./images/logo2x.png')} style = {{alignSelf: "center", resizeMode: 'center'}} />
        <Text style = {{textAlign: 'center', lineHeight: 21, color:'#767C9F' }}>P-hjälpen är skapad av bilägare för bilägare i syfte att spara dina pengar till något vettigare.</Text>
        <Text style = {{textAlign: 'center', marginTop: '10%', lineHeight: 21, color:'#767C9F' }}>v. 1.0.1</Text>
      </View>
      </View>
    </SafeAreaView>
  );
}
function DrawerNavigator() {
  return (
    <Drawer.Navigator 
    drawerStyle={{
      width:'80%'
    }}
    initialRouteName="Home"
    drawerContent={props => CutomDrawerContent(props)}
    hideStatusBar
    >
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="MyCar" component={MyCarScreen}/>
    </Drawer.Navigator>
  )
}
// ONBOARDING NAVIGATION
const StackApp = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
        <StackApp.Navigator initialRouteName="SplashScreen">
          <StackApp.Screen name="HomeApp" component={DrawerNavigator} options={navOptionHandler}/>
          <StackApp.Screen name="SplashScreen" component={SplashScreen} options={navOptionHandler}/>
          <StackApp.Screen name="Onboarding1" component={Onboarding1} options={navOptionHandler}/>
          <StackApp.Screen name="Onboarding2" component={Onboarding2} options={navOptionHandler}/>
          <StackApp.Screen name="Onboarding3" component={Onboarding3} options={navOptionHandler}/>
          <StackApp.Screen name="Onboarding4" component={Onboarding4} options={navOptionHandler}/>
          <StackApp.Screen name="Onboarding5" component={Onboarding5} options={navOptionHandler}/>
      </StackApp.Navigator>
    </NavigationContainer>
  );
}
export default connect()(App)
