import * as React from 'react';
import { Button, View, Text } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { API_KEY } from 'react-native-dotenv';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import SlidingUpPanel from 'rn-sliding-up-panel';

Geocoder.init(API_KEY);

const apiUrl = 'http://localhost:8080/api/';

const styles = {
  container: {
    //flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
    position: 'relative',
    top: '50%'
  }
}

const initialPosition = {
  latitude: 59.3324,
  longitude: 18.0645,
  latitudeDelta: 0.0562,
  longitudeDelta: 0.0515,
  adress: ''
};

function setGeo() {
    Geolocation.getCurrentPosition(
      async info => {
        const newPosition = { ...newPosition };
        newPosition.latitude = info.coords.latitude;
        newPosition.longitude = info.coords.longitude;
        newPosition.adress = await getLocation(newPosition.latitude, newPosition.longitude);
        setCurrentPosition(newPosition);
      }, error => console.log(error.message), 
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }

function Home() {
  const [region, setRegion] = React.useState(initialPosition);
  const [currentPosition, setCurrentPosition] = React.useState(initialPosition);
  const [currentPositionCar, setCurrentPositionCar] = React.useState(initialPosition);
  const [followUser, setFollowUser] = React.useState(false);

  return (
    <View
        style={{
          flex: 1
        }}
      >
      <MapView
        style={{
          flex: 1
        }}
        showsPointsOfInterest={false}
        followsUserLocation={true}
        showsUserLocation={true}
        initialRegion={region}
        onMarkerDragEnd={ async (e) => {
          const newPositionCar = { ...currentPositionCar };
          newPositionCar.latitude = e.nativeEvent.coordinate.latitude;
          newPositionCar.longitude = e.nativeEvent.coordinate.longitude;
          newPositionCar.adress = await getLocation(newPositionCar.latitude, newPositionCar.longitude)
          setCurrentPositionCar(newPositionCar);
          console.log(`${apiUrl}${newPositionCar.adress}`);
          await axios.get(`${apiUrl}${newPositionCar.adress}`)
            .then(res => {
              console.log(res.data.properties.ADDRESS);
            })
            .catch(err => console.log(err));
        }}
        onMapReady={ async () => {
          const newPositionCar = { ...currentPositionCar };
          newPositionCar.adress = await getLocation(newPositionCar.latitude, newPositionCar.longitude);
          setCurrentPositionCar(newPositionCar);
          console.log(currentPositionCar)
          this.region={region} // We want to do this not on every render
        }}
        style={{height:'100%'}}
        onRegionChangeComplete={region => setRegion(region)}
      >

        
        <Marker draggable
            coordinate={currentPositionCar}
            title='Din bil'
            description={currentPositionCar.adress}
        />
      </MapView>
      <View
        style={{
            backgroundColor:'#fff',
            position: 'absolute',//use absolute position to show button on top of the map
            top: '10%', //for center align
            right: '10%',
            alignSelf: 'flex-end' //for align to right
        }}
    >
        <Button title="You" onPress={()=> {
            console.log(followUser);
            setFollowUser(true)
            console.log(followUser);
            }
        }
         />
    </View>
      <View
        style={{
        backgroundColor: '#fff',
        position: 'relative',
        bottom: 70,
        height: "10%",
        width: "100%",
        borderWidth: 0,
        borderColor: '#F56',
        borderRadius: 30
        }}
        >
        <Button title='Show panel' onPress={() => this._panel.show()} />
        <SlidingUpPanel ref={c => this._panel = c}>
          <View style={styles.container}>
            <Text>Here is the content inside panel</Text>
            <Button title='Hide' onPress={() => this._panel.hide()} />
          </View>
        </SlidingUpPanel>
      </View>
  </View>
  );
}

async function getLocation(lat, long) {
  const address = await Geocoder.from(lat, long)
    .then(json => json.results[0].address_components[1].long_name)
    .catch(error => console.warn(error));
  return address;
}

export default Home;