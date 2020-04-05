import * as React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { API_KEY } from 'react-native-dotenv';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { getDistance } from 'geolib';
import { connect } from 'react-redux';
import { changeCount, changeParkedPos } from '../actions/counts.js';

Geocoder.init(API_KEY);

const apiUrl = 'http://localhost:8080/api/';

const initialPosition = {
  latitude: 59.3324,
  longitude: 18.0645,
  latitudeDelta: 0.003,
  longitudeDelta: 0.002,
  adress: ''
};

function HomeScreen({navigation, count, changeCount, changeParkedPos}) {
  const [region, setRegion] = React.useState(initialPosition);
  const [panelData, setPanelData] = React.useState("Parkeringsinfo");
  const [currentPosition, setCurrentPosition] = React.useState(initialPosition);
  // const [parkedPosition, setParkedPosition] = React.useState(currentPosition);
  // const [parked, setParked] = React.useState(false);

  function userLocation (){
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
      latitude: currentPosition.latitude,
      longitude: currentPosition.longitude,
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
        // followsUserLocation={true}
        // showsUserLocation={true}
        initialRegion={region}
        onMarkerDragEnd={ async (e) => {
          const newPosition = { ...currentPosition };
          newPosition.latitude = e.nativeEvent.coordinate.latitude;
          newPosition.longitude = e.nativeEvent.coordinate.longitude;
          newPosition.adress = await getLocation(newPosition.latitude, newPosition.longitude)
          setCurrentPosition(newPosition);
          await axios.get(`${apiUrl}${newPosition.adress}`)
            .then(res => {
              console.log(res.data.length)
              setPanelData(res.data.length ? `${res.data[0].day} kl. ${res.data[0].hours}:${res.data[0].minutes}` : "")
              })
              .catch(err => console.log(err));
        }}
        onMapReady={ async () => {
          const newPosition = { ...currentPosition };
          newPosition.adress = await getLocation(newPosition.latitude, newPosition.longitude);
          setCurrentPosition(newPosition);
          console.log(currentPosition)
          this.region={region}
        }}
        onRegionChangeComplete={region => {
          setRegion(region);
          console.log(region);
        }}
      >
        <Marker
        image={require('../images/circle.png')}
          draggable
          coordinate={currentPosition}
        />
        <Marker
          coordinate={count.parked ? count.parkedPosition : currentPosition}
        />
      </MapView>
      <View style={styles.userLocation}>
        <Button title="You" onPress={()=> userLocation()}/>
        <Button title="Car" onPress={()=> carLocation()}/>
        <Button title="Settings" onPress={()=> navigation.openDrawer()}/>
      </View>
        <SlidingUpPanel ref={c => this._panel = c}
        draggableRange={{top:Dimensions.get('screen').height * 0.25, bottom:0}}
        backdropOpacity={0}>
          <View style={styles.slidingUpPanel}>
          <View style={{ alignItems: "center" }}>
            <View style ={{  marginVertical: 10, height: 4, width: '50%', backgroundColor: 'lightgrey', opacity: 0.3 }}/>
          </View>
          <Text style={styles.panelHeader}>{count.parked ? 'Parkerad' : 'Ej parkerad'}</Text>
          <Text style={styles.text}>{count.parked ? count.parkedPosition.adress : currentPosition.adress}</Text>
          <View style ={{  marginVertical: 10, height: 2, backgroundColor: 'lightgrey', opacity: 0.3 }}/>
          <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between"}}>
      <Text style={styles.text}>{panelData ? 'Flytta senast': 'Parkering tillåten'}</Text>
            <Text style={styles.text}>{panelData ? panelData : ''}</Text>
          </View>
          <View style ={{ marginVertical: 10, height: 2, backgroundColor: 'lightgrey', opacity: 0.3  }}/>
          <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.text}>Taxeområde</Text>
            <Text style={styles.text}>X</Text>
          </View>
          <Text>{count.parkedPosition.latitude ? getDistance(
                    { latitude: count.parkedPosition.latitude, longitude: count.parkedPosition.longitude },
                    { latitude: currentPosition.latitude, longitude: currentPosition.longitude } 
                  )
                  :
                  '0'
                }
              </Text>

          {/* <Text>{ count.parkedPosition.latitude.toString() }</Text> */}
          <TouchableOpacity
            onPress={() => {
              count.parked ? changeCount(false) : changeCount(true)
              changeParkedPos(currentPosition);
            }}
            style={styles.parkingButton}
            >
              <Text style={styles.parkingButtonText}>
            { count.parked ? 'Avsluta parkering' : 'Parkera här ' }
              </Text>
          </TouchableOpacity>
            </View>
        </SlidingUpPanel>
  </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: Dimensions.get('screen').height * 0.025,
    color: '#001E39'
  },
  panelHeader: {
    fontSize: Dimensions.get('screen').height * 0.04,
    fontWeight: 'bold',
    color: '#001E39'
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
    bottom: '15%',
    height: "40%",
    width: "100%",
    borderWidth: 0,
    borderColor: '#F56',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20
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

function mapStateToProps (state) {
  return {
    count: state.count,
  }
}

const mapDispatchToProps = dispatch => ({
  changeCount: count => dispatch(changeCount(count)),
  changeParkedPos: parkedPosition => dispatch(changeParkedPos(parkedPosition)),
})

export default connect(
mapStateToProps, mapDispatchToProps
)(HomeScreen)
