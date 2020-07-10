import * as React from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {API_KEY} from 'react-native-dotenv';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import SlidingUpPanel from 'rn-sliding-up-panel';
import {getDistance} from 'geolib';
import {connect} from 'react-redux';
import {
  changeCount,
  changeParkedPos,
  setInvalidTime,
  changeCarConnection,
} from '../actions/counts.js';
import {initialLineCoords} from '../constants/coords';
import {
  sendScheduledNotification,
  sendNotification,
} from '../utils/notifications';
import {taxa2, taxa3, taxa4, checkTaxa, checkAvgif} from '../utils/taxaData';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
//TODO: replace API_KEY with your own api key from google for the geocoder api.
Geocoder.init(API_KEY);
//TODO: CLOUD SERVER HEROKU, set this up and you dont need to worry about running a local server
const apiUrl = 'https://damp-everglades-43130.herokuapp.com/api/adresses/';
const apiRegionUrl = 'https://damp-everglades-43130.herokuapp.com/api/regions/';
//TODO: LOCAL SERVER if you use these then you have to run your local server
// const apiUrl = 'http://192.168.8.125:8080/api/adresses/';
// const apiRegionUrl = 'http://192.168.8.125:8080/api/regions/';

const taxa2Arr = [
  'Sveavägen',
  'Odengatan',
  'Karlbergsvägen',
  'Sturegatan',
  'Värtavägen',
  'Bobergsgatan',
  'Torsgatan',
  'Sankt Eriksgatan',
  'Fleminggatan',
  'Hornsgatan',
  'Rosenlundsgatan',
  'Götgatan',
  'Folkungagatan',
  'Renstiernas Gata',
];

const taxa1Arr = [
  'Klarabergsviadukten',
  'Klarabersgatan',
  'Mäster Samuelsgatan',
  'Hamngatan',
  'Brunkebergstorg',
  'Benny Fredrikssons Torg',
  'Sergelgången',
  'Malmltorgsgatan',
];

const initialPosition = {
  latitudeDelta: 0.006,
  longitudeDelta: 0.004,
  adress: '',
};

Geolocation.getCurrentPosition(gps => {
  initialPosition.latitude = gps.coords.latitude;
  initialPosition.longitude = gps.coords.longitude;
});

// TODO: Create helper file for the mapview
function HomeScreen({
  navigation,
  count,
  changeCount,
  changeParkedPos,
  changeCarConnection,
  setInvalidTime,
}) {
  const [region, setRegion] = React.useState(initialPosition);
  const [panelData, setPanelData] = React.useState('');
  const [timeData, setTimeData] = React.useState('');
  const [onGoing, setOngoing] = React.useState(false);
  const [currentPosition, setCurrentPosition] = React.useState(initialPosition);
  const [carPosition, setCarPosition] = React.useState(initialPosition);
  const [lineCoords, setLineCoords] = React.useState(initialLineCoords);
  const [justUpdated, setJustUpdated] = React.useState(false);
  const [taxeomrade, setTaxeomrade] = React.useState('');
  const [taxeomradeB, setTaxeomradeB] = React.useState('');

  React.useEffect(() => {
    if (count.parked) {
      if (count.connectedToCar && distanceToCar() > 60) {
        changeCarConnection(false);
        if (count.reminderTopay) {
          sendNotification(`Du har väl inte glömt att betala p-avgiften?`);
        }
      }
      if (!count.connectedToCar && distanceToCar() < 40) {
        changeCarConnection(true);
        if (count.reminderStoppay) {
          sendNotification('Du har väl inte glömt att avsluta p-avgiften?');
        }
      }
    }
  }, [currentPosition]);

  function distanceToCar() {
    return getDistance(
      {
        latitude: count.parkedPosition.latitude,
        longitude: count.parkedPosition.longitude,
      },
      {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      },
    );
  }

  function userLocation() {
    this.map.animateToRegion({
      latitude: currentPosition.latitude,
      longitude: currentPosition.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
    setTimeout(
      () => getLineCoords(currentPosition.latitude, currentPosition.longitude),
      500,
    );
  }

  function carLocation() {
    this.map.animateToRegion({
      latitude: carPosition.latitude,
      longitude: carPosition.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
    setTimeout(
      () => getLineCoords(carPosition.latitude, carPosition.longitude),
      500,
    );
  }

  async function getLineCoords(lat, long) {
    if (!justUpdated) {
      setJustUpdated(true);
      setTimeout(() => {
        setJustUpdated(false);
      }, 1000);
      await axios
        .get(`${apiRegionUrl}${lat},${long}`)
        .then(res => {
          setLineCoords(res.data);
        })
        .catch(err => console.log(err));
    }
  }

  async function getLocation(lat, long) {
    const address = await Geocoder.from(lat, long)
      .then(json => {
        if (
          taxa1Arr.includes(
            json.results[2].formatted_address
              .split(',')[0]
              .replace(/[0-9-]/g, '')
              .trim(),
          )
        ) {
          setTaxeomradeB('Taxa1');
        } else if (
          taxa2Arr.includes(
            json.results[2].formatted_address
              .split(',')[0]
              .replace(/[0-9-]/g, '')
              .trim(),
          )
        ) {
          setTaxeomradeB('City');
        } else {
          setTaxeomradeB(json.results[0].address_components[2].long_name);
        }
        return json;
      })
      .then(json => json.results[2].formatted_address.split(',')[0])
      .catch(error => console.warn(error));
    return address;
  }

  async function getPanelData(adress) {
    await axios
      .get(`${apiUrl}${adress}`)
      .then(res => {
        if (res.data && res.data[0]) {
          let dayString = res.data[0].day.slice(0, 3);
          console.log(adress.replace(/[0-9-]/g, ''));
          setPanelData(
            `${dayString} kl. ${res.data[0].hours}-${res.data[0].endHours}`,
          );
          setTimeData(res.data[0].durationObj);
          setOngoing(res.data[0].onGoing);
          setInvalidTime(res.data[0].startTimeObject);
          if (taxa1Arr.includes(adress.replace(/[0-9-]/g, '').trim())) {
            setTaxeomrade('Taxa1');
          } else if (taxa2Arr.includes(adress.replace(/[0-9-]/g, '').trim())) {
            setTaxeomrade('City');
          } else {
            setTaxeomrade(res.data[0].parkingDistrict);
          }
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <View style={styles.flexOne}>
      <MapView
        ref={c => (this.map = c)}
        style={styles.mapView}
        showsPointsOfInterest={false}
        showsUserLocation={true}
        onMapReady={async () => {
          const newPosition = {...currentPosition};
          newPosition.adress = await getLocation(
            newPosition.latitude,
            newPosition.longitude,
          );
          setCurrentPosition(newPosition);
          setCarPosition(
            count.parkedPosition ? count.parkedPosition : newPosition,
          );
          this.region = {region};
          const adress = count.parkedPosition
            ? count.parkedPosition.adress
            : carPosition.adress;
          await getPanelData(adress);
        }}
        onUserLocationChange={async e => {
          const newPosition = {...currentPosition};
          newPosition.latitude = e.nativeEvent.coordinate.latitude;
          newPosition.longitude = e.nativeEvent.coordinate.longitude;
          newPosition.adress = await getLocation(
            newPosition.latitude,
            newPosition.longitude,
          );
          setCurrentPosition(newPosition);
        }}
        initialRegion={region}
        //onmarkerdragend is pointless for now. but we can maybe use it for dragging the car AFTER it's parked
        onMarkerDragEnd={async e => {
          const newCarPosition = {...currentPosition};
          newCarPosition.latitude = e.nativeEvent.coordinate.latitude;
          newCarPosition.longitude = e.nativeEvent.coordinate.longitude;
          newCarPosition.adress = await getLocation(
            newCarPosition.latitude,
            newCarPosition.longitude,
          );
          setCarPosition(newCarPosition);
          await getPanelData(newCarPosition.adress);
        }}
        onRegionChangeComplete={region => {
          setRegion(region);
          getLineCoords(region.latitude, region.longitude);
        }}>
        {lineCoords.map((c, i) => (
          <Polyline
            key={i}
            coordinates={c}
            strokeColor="#2EA6D7"
            strokeWidth={4}
          />
        ))}
        {count.parked ? (
          <Marker coordinate={count.parkedPosition}>
            <Image
              source={require('../images/parked_car2x.png')}
              style={styles.parkedCarIcon}
            />
          </Marker>
        ) : (
          <Marker draggable coordinate={currentPosition}>
            <Image
              source={require('../images/parked_car2x.png')}
              style={styles.parkedCarIcon}
            />
          </Marker>
        )}
      </MapView>
      <View style={styles.myPositionButtonContainer}>
        <TouchableOpacity onPress={() => userLocation()}>
          <Image
            source={require('../images/position2x.png')}
            style={styles.positionIcons}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.carPositionButtonContainer}>
        <TouchableOpacity onPress={() => carLocation()}>
          <Image
            source={require('../images/car2x.png')}
            style={styles.positionIcons}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.drawerIconContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image
            source={require('../images/hamburger2x.png')}
            style={styles.drawerIcon}
          />
        </TouchableOpacity>
      </View>
      <SlidingUpPanel
        ref={c => (this._panel = c)}
        draggableRange={{
          top: Dimensions.get('screen').height * 0.35,
          bottom: 0,
        }}
        backdropOpacity={0}>
        <View style={styles.slidingUpPanel}>
          <View style={styles.panelTopBoarder} />
          <View style={styles.panelItemsPlacement}>
            <View>
              <Text style={styles.panelHeader}>
                {count.parked ? 'Parkerad' : 'Ej parkerad'}
              </Text>
            </View>
            {count.parked ? (
              <Image
                style={styles.checkedIcon}
                source={require('../images/checked.png')}
              />
            ) : null}
          </View>
          <Text style={styles.text}>
            {carPosition ? carPosition.adress : currentPosition.adress}
          </Text>
          <View style={styles.panelFullWidthBoarders} />
          <View style={styles.panelItemsPlacement}>
            <View style={styles.itemRowWrapper}>
              <Image
                style={styles.cleaningIcon}
                source={require('../images/cleaning2x.png')}
              />
              {panelData && timeData.days !== undefined ? (
                <View style={styles.displayFlex}>
                  <Text style={styles.text}>
                    {panelData ? 'Städgata' : 'Parkering tillåten'}
                  </Text>
                  {timeData ? (
                    <Text style={styles.feeAndCleaningInfo}>
                      {onGoing
                        ? `Slutar om ${timeData.hours}h ${timeData.minutes}m`
                        : `Börjar om ${timeData.days}d ${timeData.hours}h`}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <View style={styles.displayFlex}>
                  <Text style={styles.text}>
                    {panelData ? 'Städgata' : 'Parkering tillåten'}
                  </Text>
                  {timeData ? (
                    <Text style={styles.feeAndCleaningInfo}>
                      {onGoing
                        ? `Slutar om ${timeData.hours}h ${timeData.minutes}m`
                        : `Börjar om ${timeData.hours}h`}
                    </Text>
                  ) : null}
                </View>
              )}
            </View>
            <Text style={styles.text}>{panelData ? panelData : ''}</Text>
          </View>
          <View style={styles.panelFullWidthBoarders} />
          <View>
            <View style={styles.panelItemsPlacement}>
              <View style={styles.itemRowWrapper}>
                <Image
                  style={styles.taxeomradeIcon}
                  source={require('../images/taxa2x.png')}
                />
                <View style={styles.displayFlex}>
                  <Text style={styles.text}>Taxeområde</Text>
                  {
                    <Text style={styles.feeAndCleaningInfo}>
                      {taxeomrade
                        ? checkAvgif(taxeomrade)
                        : checkAvgif(taxeomradeB)}
                    </Text>
                  }
                </View>
              </View>
              <Text style={styles.text}>
                {taxeomrade
                  ? checkTaxa(taxeomrade)[0]
                  : checkTaxa(taxeomradeB)[0]}
              </Text>
            </View>
            <View style={styles.panelFullWidthBoarders} />
          </View>
          {count.parked && panelData !== '' ? (
            <View style={styles.panelItemsPlacement}>
              <View style={styles.itemRowWrapper}>
                <Image
                  style={styles.reminderIcon}
                  source={require('../images/reminder2x.png')}
                />
                <Text style={styles.text}>Påminnelse</Text>
              </View>
              {count.reminderInvalidParking ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Settings')}>
                  <Text style={styles.text}>
                    {count.remindTime
                      ? `${count.remindTime} min innan`
                      : 'Välj antal min'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Settings')}>
                  <Text style={styles.activateReminderButton}>Aktivera</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
          {count.parked ? (
            <TouchableOpacity
              onPress={() => {
                setCarPosition(currentPosition);
                changeCount(false);
                PushNotificationIOS.cancelAllLocalNotifications();
              }}
              style={styles.parkingButton}>
              <Text style={styles.parkingButtonText}>Avsluta parkering</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                changeCount(true);
                changeParkedPos(carPosition);
                if (count.invalidParkingTime && count.reminderInvalidParking) {
                  sendScheduledNotification(
                    count.invalidParkingTime,
                    count.reminderInvalidParking,
                    count.invalidParkingTime,
                  );
                }
                changeCarConnection(true);
              }}
              style={styles.parkingButton}>
              <Text style={styles.parkingButtonText}>Parkera här</Text>
            </TouchableOpacity>
          )}
        </View>
      </SlidingUpPanel>
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: Dimensions.get('screen').height * 0.021,
    fontWeight: '500',
    // fontSize: Dimensions.get('screen').height * 0.025,
    color: '#001E39',
  },
  panelHeader: {
    fontSize: Dimensions.get('screen').height * 0.031,
    // fontSize: Dimensions.get('screen').height * 0.04,
    fontWeight: 'bold',
    color: '#001E39',
  },
  panelItemsPlacement: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemRowWrapper: {
    flexDirection: 'row',
  },
  checkedIcon: {
    marginTop: 9,
    width: 30,
    height: 30,
  },
  cleaningIcon: {
    height: 24,
    width: 19,
    marginRight: 13,
    marginTop: 2,
  },
  taxeomradeIcon: {
    height: 22,
    width: 22,
    marginRight: 13,
    marginTop: 2,
  },
  reminderIcon: {
    height: 23,
    width: 19,
    marginRight: 13,
  },
  feeAndCleaningInfo: {
    marginTop: 5,
    color: '#767C9F',
  },
  mapView: {
    flex: 1,
    height: '100%',
  },
  slidingUpPanel: {
    backgroundColor: '#fff',
    position: 'relative',
    bottom: '15%',
    height: '60%',
    width: '100%',
    borderWidth: 0,
    borderColor: '#F56',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  panelTopBoarder: {
    marginTop: 6,
    marginBottom: Dimensions.get('screen').height * 0.02,
    height: Dimensions.get('screen').height * 0.004,
    width: '25%',
    backgroundColor: 'lightgrey',
    opacity: 0.4,
    alignSelf: 'center',
  },
  panelFullWidthBoarders: {
    marginTop: Dimensions.get('screen').height * 0.02,
    marginBottom: Dimensions.get('screen').height * 0.015,
    height: 2,
    backgroundColor: 'lightgrey',
    opacity: 0.3,
  },
  userLocation: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: '10%',
    right: '10%',
    alignSelf: 'flex-end',
  },
  activateReminderButton: {
    fontSize: Dimensions.get('screen').height * 0.025,
    color: 'steelblue',
  },
  parkingButton: {
    alignSelf: 'stretch',
    backgroundColor: '#001E39',
    borderRadius: 34,
    borderWidth: 1,
    height: Dimensions.get('screen').height * 0.065,
    margin: 'auto',
    marginTop: Dimensions.get('screen').height * 0.025,
    width: '100%',
    justifyContent: 'center',
  },
  parkingButtonText: {
    alignSelf: 'center',
    fontSize: Dimensions.get('screen').height * 0.022,
    color: '#F5C932',
  },
  drawerIconContainer: {
    position: 'absolute',
    top: '7%',
    left: '5%',
  },
  drawerIcon: {
    width: 50,
    height: 50,
  },
  displayFlex: {
    display: 'flex',
  },
  flexOne: {
    flex: 1,
  },
  draggablePersonIcon: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
  parkedCarIcon: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
    position: 'relative',
    bottom: 20,
  },
  myPositionButtonContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    top: '7%',
    right: '5%',
    width: 50,
    height: 50,
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  carPositionButtonContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    top: '16%',
    right: '5%',
    width: 50,
    height: 50,
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  positionIcons: {
    width: '50%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});

function mapStateToProps(state) {
  return {
    count: state.count,
  };
}
const mapDispatchToProps = dispatch => ({
  changeCount: count => dispatch(changeCount(count)),
  changeParkedPos: parkedPosition => dispatch(changeParkedPos(parkedPosition)),
  setInvalidTime: time => dispatch(setInvalidTime(time)),
  changeCarConnection: isConnected =>
    dispatch(changeCarConnection(isConnected)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreen);
