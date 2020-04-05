import * as React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { API_KEY } from 'react-native-dotenv';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { getDistance } from 'geolib';
import { connect } from 'react-redux';
import { changeCount, changeParkedPos } from '../actions/counts.js';

Geocoder.init(API_KEY);

const apiUrl = 'http://localhost:8080/api/adresses/';
const apiRegionUrl = 'http://localhost:8080/api/regions/';

const initialLineCoords = [[{"latitude":59.332833,"longitude":18.062041},{"latitude":59.332679,"longitude":18.061457},{"latitude":59.332372,"longitude":18.060292}],[{"latitude":59.332568,"longitude":18.061027},{"latitude":59.332506,"longitude":18.060793}],[{"latitude":59.333084,"longitude":18.062875},{"latitude":59.333061,"longitude":18.062798}],[{"latitude":59.330799,"longitude":18.066596},{"latitude":59.330919,"longitude":18.066472}],[{"latitude":59.332372,"longitude":18.06798},{"latitude":59.332338,"longitude":18.067985},{"latitude":59.332254,"longitude":18.068},{"latitude":59.332169,"longitude":18.068014},{"latitude":59.332078,"longitude":18.06803},{"latitude":59.331938,"longitude":18.068055},{"latitude":59.331814,"longitude":18.068075},{"latitude":59.331782,"longitude":18.068081},{"latitude":59.331754,"longitude":18.068086}],[{"latitude":59.331773,"longitude":18.066712},{"latitude":59.331983,"longitude":18.066678},{"latitude":59.331984,"longitude":18.066677},{"latitude":59.332072,"longitude":18.066661},{"latitude":59.332272,"longitude":18.066624},{"latitude":59.332273,"longitude":18.066624},{"latitude":59.332472,"longitude":18.066584},{"latitude":59.33268,"longitude":18.066542},{"latitude":59.332681,"longitude":18.066541},{"latitude":59.333,"longitude":18.066462},{"latitude":59.333001,"longitude":18.066462},{"latitude":59.333015,"longitude":18.066458},{"latitude":59.333015,"longitude":18.066458},{"latitude":59.333318,"longitude":18.066376},{"latitude":59.333319,"longitude":18.066376},{"latitude":59.333671,"longitude":18.066259}],[{"latitude":59.332284,"longitude":18.066395},{"latitude":59.33246,"longitude":18.06636},{"latitude":59.332667,"longitude":18.066318},{"latitude":59.332879,"longitude":18.066265}],[{"latitude":59.33241,"longitude":18.066587},{"latitude":59.332471,"longitude":18.066574},{"latitude":59.332679,"longitude":18.066532},{"latitude":59.332681,"longitude":18.066532},{"latitude":59.332712,"longitude":18.066524}],[{"latitude":59.332867,"longitude":18.066253},{"latitude":59.332984,"longitude":18.066223},{"latitude":59.332999,"longitude":18.066219},{"latitude":59.3333,"longitude":18.066138},{"latitude":59.333633,"longitude":18.066028}],[{"latitude":59.333698,"longitude":18.065818},{"latitude":59.333561,"longitude":18.065265},{"latitude":59.333363,"longitude":18.064468},{"latitude":59.333139,"longitude":18.063565}]]

const initialPosition = {
  latitude: 59.3324,
  longitude: 18.0645,
  latitudeDelta: 0.006,
  longitudeDelta: 0.004,
  adress: ''
};

function HomeScreen({navigation, count, changeCount, changeParkedPos}) {
  const [region, setRegion] = React.useState(initialPosition);
  const [panelData, setPanelData] = React.useState("Parkeringsinfo");
  const [currentPosition, setCurrentPosition] = React.useState(initialPosition);
  const [lineCoords, setLineCoords] = React.useState(initialLineCoords)
  const [justUpdated, setJustUpdated] = React.useState(false);
  // const [parkedPosition, setParkedPosition] = React.useState(currentPosition);
  // const [parked, setParked] = React.useState(false);

  function userLocation (){
    this.map.animateToRegion({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      })
  }
  // function userLocation (){
  //   Geolocation.getCurrentPosition(
  //     async info => {
  //         this.map.animateToRegion({
  //             latitude: info.coords.latitude,
  //             longitude: info.coords.longitude,
  //             latitudeDelta: 0.005,
  //             longitudeDelta: 0.005
  //           })
  //       }, error => console.log(error.message), 
  //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  //   )
  // }
  function carLocation (){
    this.map.animateToRegion({
      latitude: currentPosition.latitude,
      longitude: currentPosition.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    })
  }

  async function getLineCoords(lat, long) {
    if (!justUpdated) {
      setJustUpdated(true);
      setTimeout(() => {
        setJustUpdated(false);
      }, 1000)
      await axios.get(`${apiRegionUrl}${lat},${long}`)
        .then(res => {
          console.log('API used for Line coords!!!');
          setLineCoords(res.data);
        })
        .catch(err => console.log(err));
      }
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
          this.region={region}
        }}
        onRegionChangeComplete={region => {
          setRegion(region);
          getLineCoords(region.latitude, region.longitude)
        }}
      >
        <Polyline 
          coordinates={lineCoords[0]}
          strokeColor="#FFA500"
          strokeWidth={4}
        />
        <Polyline 
          coordinates={lineCoords[1]}
          strokeColor="#FFA500"
          strokeWidth={4}
        />
        <Polyline 
          coordinates={lineCoords[2]}
          strokeColor="#FFA500"
          strokeWidth={4}
        />
        <Polyline 
          coordinates={lineCoords[3]}
          strokeColor="#FFA500"
          strokeWidth={4}
        />
        <Polyline 
          coordinates={lineCoords[4]}
          strokeColor="#FFA500"
          strokeWidth={4}
        />
        <Polyline 
          coordinates={lineCoords[5]}
          strokeColor="#FFA500"
          strokeWidth={4}
        />
        <Polyline 
          coordinates={lineCoords[6]}
          strokeColor="#FFA500"
          strokeWidth={4}
        />
        <Polyline 
          coordinates={lineCoords[7]}
          strokeColor="#FFA500"
          strokeWidth={4}
        />
        <Polyline 
          coordinates={lineCoords[8]}
          strokeColor="#FFA500"
          strokeWidth={4}
        />
        <Polyline 
          coordinates={lineCoords[9]}
          strokeColor="#FFA500"
          strokeWidth={4}
        />
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
