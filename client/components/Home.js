import * as React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { API_KEY } from 'react-native-dotenv';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import SlidingUpPanel from 'rn-sliding-up-panel';
// import EStyleSheet from 'react-native-extended-stylesheet';

Geocoder.init(API_KEY);

const apiUrl = 'http://localhost:8080/api/';

const initialPosition = {
  latitude: 59.3324,
  longitude: 18.0645,
  latitudeDelta: 0.0562,
  longitudeDelta: 0.0515,
  adress: ''
};

function HomeScreen({navigation}) {

  const [region, setRegion] = React.useState(initialPosition);
  const [panelData, setPanelData] = React.useState("Parkeringsinfo");
  const [currentPositionCar, setCurrentPositionCar] = React.useState(initialPosition);

  function userLocation (){
    console.log('userLocation Called');
    Geolocation.getCurrentPosition(
      async info => {
          this.map.animateToRegion({
              latitude: info.coords.latitude,
              longitude: info.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005
            })
        }, error => console.log(error.message), 
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }
  function carLocation (){
    this.map.animateToRegion({
      latitude: currentPositionCar.latitude,
      longitude: currentPositionCar.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    })
  }

  async function getLocation(lat, long) {
    console.log('getLocation Called');
    const address = await Geocoder.from(lat, long)
      .then(json => json.results[0].formatted_address.split(',')[0])
      .catch(error => console.warn(error));
    return address;
  }

  return (
    <View style={{flex: 1 }}>

      <MapView
        ref={c => this.map = c}
        style={styles.mapView}
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
          await axios.get(`${apiUrl}${newPositionCar.adress}`)
            .then(res => {
              setPanelData(res.data[0] ? res.data[0]: "Inget planerat underhåll på denna adress")
              console.log(panelDate);
              })
              .catch(err => console.log(err));
        }}
        onMapReady={ async () => {
          const newPositionCar = { ...currentPositionCar };
          newPositionCar.adress = await getLocation(newPositionCar.latitude, newPositionCar.longitude);
          setCurrentPositionCar(newPositionCar);
          console.log(currentPositionCar)
          this.region={region}
        }}
        onRegionChangeComplete={region => setRegion(region)}
      >
        <Marker
            // coordinate={parked ? parkedPosition : currentPositionCar}
            coordinate={currentPositionCar}
        />
      </MapView>
      <View style={styles.userLocation}>
        <Button title="You" onPress={()=> userLocation()}/>
        <Button title="Car" onPress={()=> carLocation()}/>
        <Button title="Settings" onPress={()=> navigation.openDrawer()}/>
      </View>
        <SlidingUpPanel ref={c => this._panel = c}
        draggableRange={{top:Dimensions.get('screen').height * 0.3, bottom:0}}
        backdropOpacity={0}>
          <View style={styles.slidingUpPanel}>
          <Text style={styles.panelHeader}>Din bil är här</Text>
          <Text style={styles.text}>{currentPositionCar.adress}</Text>
          <View style ={{  marginVertical: 10, height: 2, backgroundColor: 'lightgrey', opacity: 0.3 }}/>
          <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.text}>Städgata</Text>
            <Text style={styles.text}>{panelData}</Text>
          </View>
          <View style ={{ marginVertical: 10, height: 2, backgroundColor: 'lightgrey', opacity: 0.3  }}/>
          <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.text}>Taxeområde</Text>
            <Text style={styles.text}>X</Text>
          </View>
          <TouchableOpacity
            style={styles.parkingButton}
            >
              <Text style={styles.parkingButtonText}>
                Parkera här
              </Text>
          </TouchableOpacity>
            </View>
        </SlidingUpPanel>
  </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: Dimensions.get('screen').height * 0.03
  },
  panelHeader: {
    fontSize: Dimensions.get('screen').height * 0.04,
  },
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
    position: 'relative',
    bottom: '22%'
  },
  mapView:{
    flex: 1,
    height:'100%'
  },
  slidingUpPanel:{
    backgroundColor: '#fff',
    position: 'relative',
    bottom: '10%',
    height: "50%",
    width: "100%",
    borderWidth: 0,
    borderColor: '#F56',
    borderRadius: 30,
    padding: 20
  },
  userLocation:{
    backgroundColor:'#fff',
    position: 'absolute',
    top: '10%', 
    right: '10%',
    alignSelf: 'flex-end'
  },
  parkingButton: {
    alignSelf: 'stretch',
    backgroundColor: '#001E39',
    borderRadius: 34,
    borderWidth: 1,
    // marginHorizontal: '5%',
    height: '14%',
    // position:'absolute',
    // bottom: '28%',
    width: '100%',
    justifyContent: 'center'  
  },
    parkingButtonText: {
    alignSelf: 'center',
    fontSize: 22,
    color: '#F5C932'
    }
});


export default HomeScreen;
