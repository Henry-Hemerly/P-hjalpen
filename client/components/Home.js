import * as React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { API_KEY } from 'react-native-dotenv';
// import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { getDistance } from 'geolib';
import { connect } from 'react-redux';
import { changeCount, changeParkedPos, setInvalidTime, changeCarConnection } from '../actions/counts.js';
import { initialLineCoords } from '../constants/coords'
var PushNotification = require("react-native-push-notification");
import PushNotificationIOS from "@react-native-community/push-notification-ios";

const taxa2 = ['Norrmalm', 'Gamla Stan']
const taxa3 = ['Kungsholmen', 'Vasastaden', 'Östermalm', 'Södermalm', 'Södra Hammarbyhamnen', 'Hjorthagen', 'Kristineberg', 'Marieberg', 'Reimersholme', 'Lilla Essingen']
const taxa4 = ['Traneberg', 'Ulvsunda', 'Stora Essingen', 'Gröndal', 'Aspudden', 'Midsommarkransen', 'Liljeholmen', 'Västberga', 'Årsta', 'Östberga', 'Enskedefältet', 'Enskede gård', 'Johanneshov', 'Gamla Enskede', 'Hammarbyhöjden', 'Kärrtorp', 'Enskededalen', 'Björkhagen']

PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true
  },
  popInitialNotification: true,
  requestPermissions: true
});

function sendNotification(message) {
  PushNotification.localNotification({
    title: "Påminnelse från P-hjälpen", // (optional)
    message: message, // (required)
  });
}

function sendScheduledNotification(startTime, min) {
  PushNotification.localNotificationSchedule({
    title: "Dags att flytta bilen?", // (optional)
    message: `Din parkering upphör snart att vara tillåten.`, // (required)
    date: new Date(Date.now() + 0.1 * 60000) // in 60 secs
  });
}

Geocoder.init(API_KEY);

const apiUrl = 'http://localhost:8080/api/adresses/';
const apiRegionUrl = 'http://localhost:8080/api/regions/';

const initialPosition = {
  latitude: 59.3324,
  longitude: 18.0645,
  latitudeDelta: 0.006,
  longitudeDelta: 0.004,
  adress: ''
};

function HomeScreen({ navigation, count, changeCount, changeParkedPos, changeCarConnection, setInvalidTime }) {
  const [region, setRegion] = React.useState(initialPosition);
  const [panelData, setPanelData] = React.useState("");
  const [timeData, setTimeData] = React.useState("");
  const [onGoing, setOngoing] = React.useState(false);
  const [currentPosition, setCurrentPosition] = React.useState(initialPosition);
  const [lineCoords, setLineCoords] = React.useState(initialLineCoords)
  const [justUpdated, setJustUpdated] = React.useState(false);
  const [taxeomrade, setTaxeomrade] = React.useState();

  React.useEffect(() => {
    if (count.parked) {
      if (count.connectedToCar && distanceToCar() > 60) {
        if (count.reminderTopay) {
          changeCarConnection(false);
          sendNotification(`Du har väl inte glömt att betala p-avgiften?`);
        }
      }
      if (!count.connectedToCar && distanceToCar() < 40) {
        if (count.reminderStoppay) {
          changeCarConnection(true);
          sendNotification('Du har väl inte glömt att avsluta p-avgiften?');
        }
      }
    }
  }, [currentPosition]);

  function distanceToCar() {
    return getDistance(
      { latitude: count.parkedPosition.latitude, longitude: count.parkedPosition.longitude },
      { latitude: currentPosition.latitude, longitude: currentPosition.longitude }
    )
  }

  function userLocation() {
    this.map.animateToRegion({
      latitude: currentPosition.latitude,
      longitude: currentPosition.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    })
  }

  function carLocation() {
    this.map.animateToRegion({
      latitude: count.parkedPosition.latitude,
      longitude: count.parkedPosition.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    });
  }

  async function getLineCoords(lat, long) {
    if (!justUpdated) {
      setJustUpdated(true);
      setTimeout(() => {
        setJustUpdated(false);
      }, 1000)
      await axios.get(`${apiRegionUrl}${lat},${long}`)
        .then(res => {
          setLineCoords(res.data);
        })
        .catch(err => console.log(err));
    }
  }

  function checkTaxa(omrade) {
    if (taxa2.includes(omrade)) {
      return ['Taxa 2','26kr/h 07-21','26kr/h 09-19','15kr/h'];
    } else if (taxa3.includes(omrade)) {
      return ['Taxa 3','15kr/h 07-19','10kr/h 11-17','ingen avgift'];
    } else if (taxa4.includes(omrade)) {
      return ['Taxa 4','10kr/h 07-19','10kr/h 11-17','ingen avgift'];
    }
    return 'Okänt'
  }
  function checkAvgif(omrade) {
    let date = new Date().getDay()
    if (date > 0 && date < 6) {
      return checkTaxa(omrade)[1]
    }else if(date == 6){
      return checkTaxa(omrade)[2]
    }else if(date == 0){
      return checkTaxa(omrade)[3]
    }
  }

  async function getLocation(lat, long) {
    const address = await Geocoder.from(lat, long)
      .then(json => {
        setTaxeomrade(json.results[0].address_components[2].long_name)
        return json;
      })
      .then(json => json.results[2].formatted_address.split(',')[0])
      .catch(error => console.warn(error));
    return address;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={c => this.map = c}
        style={styles.mapView}
        showsPointsOfInterest={false}
        initialRegion={region}
        onMarkerDragEnd={async (e) => {
          const newPosition = { ...currentPosition };
          newPosition.latitude = e.nativeEvent.coordinate.latitude;
          newPosition.longitude = e.nativeEvent.coordinate.longitude;
          newPosition.adress = await getLocation(newPosition.latitude, newPosition.longitude)
          setCurrentPosition(newPosition);
          await axios.get(`${apiUrl}${newPosition.adress}`)
            .then(res => {
              console.log(res.data.length)
              let dayString = res.data[0].day.slice(0,3)
              setPanelData(res.data.length ? `${dayString} kl. ${res.data[0].hours}-${res.data[0].endHours}` : '')
              setTimeData(res.data[0].durationObj)
              setOngoing(res.data[0].onGoing)
              setInvalidTime(res.data[0].startTimeObject ? res.data[0].startTimeObject : undefined)
            })
            .catch(err => console.log(err));
        }}
        onMapReady={async () => {
          const newPosition = { ...currentPosition };
          newPosition.adress = await getLocation(newPosition.latitude, newPosition.longitude);
          setCurrentPosition(newPosition);
          this.region = { region }
        }}
        onRegionChangeComplete={region => {
          setRegion(region);
          getLineCoords(region.latitude, region.longitude)
        }}
      >
        {lineCoords.map((c, i) => (
          <Polyline key={i}
            coordinates={c}
            strokeColor="rgb(235, 141, 141)"
            strokeWidth={4}
          />
        ))}
        <Marker draggable coordinate={currentPosition}>
          <Image source={require('../images/person.png')} style={{ height: 60, width: 60, resizeMode: 'contain' }} />
        </Marker>
        {count.parked ? <Marker coordinate={count.parked ? count.parkedPosition : currentPosition}>
          <Image source={require('../images/parked_car2x.png')} style={{ height: 50, width: 50, resizeMode: 'contain', position: 'relative', bottom:20 }} />
        </Marker> : null}

      </MapView>
      <View style={{ backgroundColor: 'white', position: "absolute", top: '7%', right: '5%', width: 50, height: 50, alignContent: "center", justifyContent: "center", borderRadius: 9 }}>
        <TouchableOpacity onPress={() => userLocation()}>
          <Image source={require('../images/position2x.png')} style={{ width: '50%', alignSelf: "center", resizeMode: "contain" }} />
        </TouchableOpacity>
      </View>
      {
        count.parked ?
          <View style={{ backgroundColor: 'white', position: "absolute", top: '15%', right: '5%', width: 50, height: 50, alignContent: "center", justifyContent: "center", borderRadius: 9 }}>
            <TouchableOpacity onPress={() => carLocation()}>
              <Image source={require('../images/car2x.png')} style={{ alignSelf: "center", resizeMode: "contain", width: '50%' }} />
            </TouchableOpacity>
          </View>
          : null
      }
      <View style={styles.drawerIcon}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}>
          <Image
            source={require('../images/hamburger2x.png')}
            style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
      </View>
      <SlidingUpPanel ref={c => this._panel = c}
        draggableRange={{ top: Dimensions.get('screen').height * 0.25, bottom: 0 }}
        backdropOpacity={0}>
        <View style={styles.slidingUpPanel}>
          <View style={{ alignItems: "center" }}>
            <View style={{ marginVertical: 10, height: 4, width: '50%', backgroundColor: 'lightgrey', opacity: 0.3 }} />
          </View>
          <Text style={styles.panelHeader}>{count.parked ? 'Parkerad' : 'Ej parkerad'}</Text>
          <Text style={styles.text}>{count.parked ? count.parkedPosition.adress : currentPosition.adress}</Text>
          <View style={{ marginVertical: 10, height: 2, backgroundColor: 'lightgrey', opacity: 0.3 }} />

          <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ display: 'flex', flexDirection: "column" }}>
            <Text style={styles.text}>{panelData ? 'Städgata' : 'Parkering tillåten'}</Text>
            {timeData ? <Text>{onGoing ? `Slutar om ${timeData.hours}h ${timeData.minutes}m`:`Börjar om ${timeData.days}d ${timeData.hours}h` }</Text>:null}
            </View>
            <Text style={styles.text}>{panelData ? panelData : ''}</Text>
          </View>

          <View style={{ marginVertical: 10, height: 2, backgroundColor: 'lightgrey', opacity: 0.3 }} />

          {
            taxeomrade ?
              <View>
                <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ display: 'flex', flexDirection: "column" }}>
                  <Text style={styles.text}>Taxeområde</Text>
                  {<Text>
                    {checkAvgif(taxeomrade)}
                    </Text>}
                  </View>
                  <Text style={styles.text}>{checkTaxa(taxeomrade)[0]}</Text>
                  
                </View>

                <View style={{ marginVertical: 10, height: 2, backgroundColor: 'lightgrey', opacity: 0.3 }} />
              </View>
              :
              null
          }

          {
            count.parked && panelData !== '' ? <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.text}>Påminnelse</Text>
              {count.reminderInvalidParking ? <Text style={styles.text}>{count.remindTime} min innan</Text> : <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Text style={{
                fontSize: Dimensions.get('screen').height * 0.025,
                color: 'steelblue'
              }}>Aktivera</Text>
              </TouchableOpacity>}
            </View> : null}
          {
            count.parked ? <TouchableOpacity
              onPress={() => {
                changeCount(false)
                PushNotificationIOS.cancelAllLocalNotifications();
                setInvalidTime(undefined)
              }
              }
              style={styles.parkingButton}>
              <Text style={styles.parkingButtonText}>Avsluta parkering</Text>
            </TouchableOpacity> :
              <TouchableOpacity
                onPress={() => {
                  changeCount(true)
                  changeParkedPos(currentPosition);
                  if (count.invalidParkingTime && count.reminderInvalidParking) { sendScheduledNotification() }
                  changeCarConnection(true);
                }}
                style={styles.parkingButton}
              >
                <Text style={styles.parkingButtonText}>Parkera här</Text>
              </TouchableOpacity>}
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
  mapView: {
    flex: 1,
    height: '100%'
  },
  slidingUpPanel: {
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
  userLocation: {
    backgroundColor: '#fff',
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
  },
  drawerIcon: {
    position: "absolute",
    top: '7%',
    left: '5%'
  }
});

function mapStateToProps(state) {
  return {
    count: state.count,
  }
}
const mapDispatchToProps = dispatch => ({
  changeCount: count => dispatch(changeCount(count)),
  changeParkedPos: parkedPosition => dispatch(changeParkedPos(parkedPosition)),
  setInvalidTime: time => dispatch(setInvalidTime(time)),
  changeCarConnection: isConnected => dispatch(changeCarConnection(isConnected)),
})
export default connect(
  mapStateToProps, mapDispatchToProps
)(HomeScreen)
