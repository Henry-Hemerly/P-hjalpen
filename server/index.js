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


// New function that gets info from API one a day
// One collection for each day
// If no error drop collection and fill with new data

const weekdayArr = ['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'];

async function dropCollection(weekday) {
  client = await MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });
  const db = client.db(dbName);
  streets = db.collection(weekday);
  db.on('close', () => { process.stdout.write('closed connection\n'); });
  db.on('reconnect', () => { process.stdout.write('reconnected\n'); });
  streets.drop();

}


function getApiData() {
  const API_URL1 = 'https://openparking.stockholm.se/LTF-Tolken/v1/servicedagar/weekday/';
  const API_URL2 = '?outputFormat=json&apiKey=231ca8a9-dc1a-41b7-a06f-87f61d585f1a';


  weekdayArr.forEach(async day => {  
    dropCollection(day);
    const response = await axios.get(API_URL1 + day + API_URL2)
    .catch((error) => console.log(error)) 
    populateDatabase(day, response.data.features);
  });

}



async function populateDatabase(weekday, data) {
  client = await MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });
  const db = client.db(dbName);
  streets = db.collection(weekday);
  db.on('close', () => { process.stdout.write('closed connection\n'); });
  db.on('reconnect', () => { process.stdout.write('reconnected\n'); });
  streets.insertMany(data, (err, res) => {
    client.close();
    if (err) return process.stdout.write(err.message);
    return process.stdout.write(`inserted count ${res.insertedCount} documents\n`);
  });
}


getApiData();

app.get('/api/:location', async (req,res) => {
  streets.findOne({'properties.STREET_NAME':req.params.location}, (err, response) => {
    // client.close();
    if (err) return process.stdout.write(err.message);
    res.send(response);
  });
});

app.listen(8080, () => console.log('server running on port 8080'));

// https://openstreetgs.stockholm.se/home/Parking
// ApiKey=231ca8a9-dc1a-41b7-a06f-87f61d585f1a
