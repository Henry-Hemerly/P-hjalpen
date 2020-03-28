const express = require('express');
const app = express();
const axios = require('axios');
const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://henry:parking@park-app-otn0c.gcp.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'parkingDB';

async function run() {
  const client = await MongoClient.connect(url, { useNewUrlParser: true });
  const db = client.db(dbName);

  db.on('close', () => { process.stdout.write('closed connection\n'); });
  db.on('reconnect', () => { process.stdout.write('reconnected\n'); });

  const streets = db.collection('test');

  streets.insertOne({a: 'youpy'}, (err, res) => {
    client.close();

    if (err) return process.stdout.write(err.message);

    return process.stdout.write(`inserted count ${res.insertedCount} documents\n`);
  });
}

run();

const API_URL = 'https://openparking.stockholm.se/LTF-Tolken/v1/servicedagar/weekday/måndag?outputFormat=json&apiKey=231ca8a9-dc1a-41b7-a06f-87f61d585f1a';

app.get('/api/:location', async (req,res) => {
    const response = await axios.get(API_URL)
    //.then((response) => JSON.parse(response))
    .catch((error) => console.log(error))
    res.send((response.data.features[3]));
});

app.listen(8080, () => console.log('server running on port 8080'));

// https://openstreetgs.stockholm.se/home/Parking
// ApiKey=231ca8a9-dc1a-41b7-a06f-87f61d585f1a
