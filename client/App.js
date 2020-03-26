import * as React from 'react';
import { Button, View, Text, Image, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapView, {Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { API_KEY } from 'react-native-dotenv';

console.log(API_KEY);


function SplashScreen({ navigation }) {
  setTimeout(() => {
    navigation.navigate('Onboarding1');
    return;
    }, 2000)

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>
        PARKING APP!!!!
      </Text>
    </SafeAreaView>
  );
}

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
Geocoder.init(API_KEY);
const initialRegion = {
  latitude: 59.3324,
  longitude: 18.0645,
  latitudeDelta: 0.0062,
  longitudeDelta: 0.0015
};

function Home({ navigation }) {
  return (
      <MapView onMarkerDragEnd={async (e) => {
        //this.setNewMarkerLocation(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
        console.log(await getLocation(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude))
      }}
        style={{height:'100%'}}
        initialRegion={initialRegion}> 
        <Marker draggable
            coordinate={initialRegion}
            title='Din plats'
            description={'poop hej'}
        />  
      </MapView>
  );
}

async function getLocation(lat, long) {
  const address = await Geocoder.from(lat, long)
    .then(json => json.results[0]['formatted_address'])
    .catch(error => console.warn(error));
  return address;
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
