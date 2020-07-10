const express = require('express');
const app = express();
const axios = require('axios');
const helpers = require('./helper');
require('dotenv').config();
const { MongoClient } = require('mongodb');

//TODO:  MONGODB
// You will need to change to your own DB cluster on mongo db atlas and get a new password to replace process.env.mongodbPassword through the .env file so that you can replace url dbName and coll
//TODO:
const url =
  'mongodb+srv://not-null:' +
  process.env.mongodbPassword +
  '@cluster0-qp1je.mongodb.net/test?retryWrites=true&w=majority';
//TODO:
const dbName = 'parkingDB';
//TODO:
let coll = 'ParkingData';
let client;
let streets;

const timeBetweenDatabaseFill = 86400000;

createClient();

setInterval(() => getApiData(), timeBetweenDatabaseFill);

async function getApiData() {
  const API_URL1 =
    'https://openparking.stockholm.se/LTF-Tolken/v1/servicedagar/weekday/';
  //TODO: You will need to change to your own openstreet api key and get a new password to replace process.env.openStreet through the .env file.
  const API_URL2 = '?outputFormat=json&apiKey=' + process.env.openStreet;

  dropCollection();
  for (let i = 0; i < helpers.weekdayArr.length; i++) {
    const response = await axios
      .get(API_URL1 + helpers.weekdayArr[i] + API_URL2)
      .catch((error) => console.log(error));
    populateDatabase(coll, response.data.features);
  }
}

async function createClient() {
  client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function dropCollection() {
  client = await MongoClient.connect(
    url,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  );
  const db = client.db(dbName);
  streets = db.collection(coll);
  db.on('close', () => {
    process.stdout.write('closed connection\n');
  });
  db.on('reconnect', () => {
    process.stdout.write('reconnected\n');
  });
}

async function populateDatabase(coll, data) {
  client = await MongoClient.connect(
    url,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  );
  const db = client.db(dbName);
  streets = db.collection(coll);
  db.on('close', () => {
    process.stdout.write('closed connection\n');
  });
  db.on('reconnect', () => {
    process.stdout.write('reconnected\n');
  }); //TODO: This outcommented code below repopulates the db but since the information is not being updated regularly it is unneccesary for now.
  // streets.insertMany(data, (err, res) => {
  //   //client.close();
  //   if (err) return process.stdout.write(err.message);
  //   return process.stdout.write(`inserted count ${res.insertedCount} documents\n`);
  // });
}

// REST API
app.get('/api/adresses/:adress', async (req, res) => {
  let streetName = req.params.adress.match(/([a-zA-ZåäöÅÄÖ]+)/)[0];
  const streetNumber = req.params.adress.match(/([0-9]+)/)[0];

  const db = client.db(dbName);
  await db
    .collection(coll)
    .find({ 'properties.ADDRESS': { $regex: new RegExp(streetName) } })
    .toArray((err, streets) => {
      const resultStreets = [];
      for (let i = 0; i < streets.length; i++) {
        const addressParts = streets[i].properties.ADDRESS.split(' ');
        if (addressParts[addressParts.length - 2] === '-') {
          const lowerNum = parseInt(
            addressParts[addressParts.length - 3].replace(
              /([a-zA-ZåäöÅÄÖ]+)/,
              ''
            )
          );
          const higherNum = parseInt(
            addressParts[addressParts.length - 1].replace(
              /([a-zA-ZåäöÅÄÖ]+)/,
              ''
            )
          );
          for (let j = lowerNum; j < higherNum + 1; j += 2) {
            if (j.toString() === streetNumber) {
              resultStreets.push(streets[i]);
            }
          }
        } else {
          if (
            addressParts[addressParts.length - 1].replace(
              /([a-zA-ZåäöÅÄÖ]+)/,
              ''
            ) === streetNumber
          ) {
            resultStreets.push(streets[i]);
          }
        }
      }

      res.send(helpers.calculateWhen(resultStreets));
    });
});

app.get('/api/regions/:region', async (req, res) => {
  const lat = req.params.region.split(',')[0];
  const long = req.params.region.split(',')[1];

  const locUrl = `https://openparking.stockholm.se/LTF-Tolken/v1/servicedagar/within?radius=300&lat=${lat}&lng=${long}&maxFeatures=1000&outputFormat=json&apiKey=${process.env.openStreet}`;

  const response = await axios.get(locUrl).catch((error) => console.log(error));
  const responses = [];
  if (response.data.features) {
    for (let i = 0; i < response.data.features.length; i++) {
      const coordinates = [];
      for (
        let j = 0;
        j < response.data.features[i].geometry.coordinates.length;
        j++
      ) {
        coordinates.push({
          latitude: response.data.features[i].geometry.coordinates[j][1],
          longitude: response.data.features[i].geometry.coordinates[j][0],
        });
      }
      responses.push(coordinates);
    }
  }
  res.send(responses);
});

app.listen(process.env.PORT || 8080, () =>
  console.log('server running on port 8080')
);
