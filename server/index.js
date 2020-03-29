const express = require('express');
const app = express();
const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config()
console.log();

const url = "mongodb+srv://not-null:"+process.env.mongodbPassword+"@cluster0-qp1je.mongodb.net/test?retryWrites=true&w=majority";
//const url = 'mongodb+srv://henry:parking@park-app-otn0c.gcp.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'parkingDB';
const API_URL = 'https://openparking.stockholm.se/LTF-Tolken/v1/servicedagar/weekday/måndag?outputFormat=json&apiKey=231ca8a9-dc1a-41b7-a06f-87f61d585f1a';
let client;
let streets; 

async function run() {
  client = await MongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true });
  const db = client.db(dbName);
  streets = db.collection('test');
  db.on('close', () => { process.stdout.write('closed connection\n'); });
  db.on('reconnect', () => { process.stdout.write('reconnected\n'); });
  // const response = await axios.get(API_URL)
  // .catch((error) => console.log(error))  
  // streets.insertMany(response.data.features, (err, res) => {
  //   client.close();
  //   if (err) return process.stdout.write(err.message);
  //   return process.stdout.write(`inserted count ${res.insertedCount} documents\n`);
  // });
}


run();

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
