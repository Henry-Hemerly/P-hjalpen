const express = require('express');
const app = express();
const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config()
console.log();

const url = "mongodb+srv://not-null:"+process.env.mongodbPassword+"@cluster0-qp1je.mongodb.net/test?retryWrites=true&w=majority";
const dbName = 'parkingDB';

let client;
let streets;

const weekdayArr = ['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'];

let coll = 'Hej';

async function dropCollection() {
  client = await MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });
  const db = client.db(dbName);
  streets = db.collection(coll);
  db.on('close', () => { process.stdout.write('closed connection\n'); });
  db.on('reconnect', () => { process.stdout.write('reconnected\n'); });
  //streets.drop();
}

async function getApiData() {
  const API_URL1 = 'https://openparking.stockholm.se/LTF-Tolken/v1/servicedagar/weekday/';
  const API_URL2 = '?outputFormat=json&apiKey=231ca8a9-dc1a-41b7-a06f-87f61d585f1a';
  dropCollection();
  for (let i = 0; i < weekdayArr.length; i++) {
    const response = await axios.get(API_URL1 + weekdayArr[i] + API_URL2)
    .catch((error) => console.log(error))
    populateDatabase(coll, response.data.features);
  };
}

async function populateDatabase(coll, data) {
  client = await MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });
  const db = client.db(dbName);
  streets = db.collection(coll);
  db.on('close', () => { process.stdout.write('closed connection\n'); });
  db.on('reconnect', () => { process.stdout.write('reconnected\n'); });
  // streets.insertMany(data, (err, res) => {
  //   // client.close();
  //   if (err) return process.stdout.write(err.message);
  //   return process.stdout.write(`inserted count ${res.insertedCount} documents\n`);
  // });
}

getApiData();



app.get('/api/:location', (req,res) => {
  const db = client.db(dbName);
  db.collection(coll).find({'properties.STREET_NAME':req.params.location}).toArray((err, response) => res.send(response))
});

app.listen(8080, () => console.log('server running on port 8080'));
