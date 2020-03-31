const express = require('express');
const app = express();
const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config()

const url = "mongodb+srv://not-null:"+process.env.mongodbPassword+"@cluster0-qp1je.mongodb.net/test?retryWrites=true&w=majority";
const dbName = 'parkingDB';

let client;
let streets;

const weekdayArr = ['söndag','måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];

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

app.get('/api/:location', async (req,res) => {
  
  const streetName = req.params.location.match(/([a-zA-ZåäöÅÄÖ]+)/)[0];
  const streetNumber = req.params.location.match(/([0-9]+)/)[0];


  const db = client.db(dbName);
  await db.collection(coll).find({'properties.ADDRESS':{$regex: new RegExp(streetName)}}).toArray((err, streets) => {
    const resultStreets = [];
    for (let i = 0; i < streets.length; i++) {
      const addressParts = streets[i].properties.ADDRESS.split(' ');
      if (addressParts[addressParts.length - 2] === '-') {
        const lowerNum = parseInt((addressParts[addressParts.length - 3]).replace(/([a-zA-ZåäöÅÄÖ]+)/, ''));
        const higherNum = parseInt((addressParts[addressParts.length - 1]).replace(/([a-zA-ZåäöÅÄÖ]+)/, ''));
        for (let j = lowerNum; j < higherNum + 1; j += 2) {
          if (j.toString() === streetNumber) {
            resultStreets.push(streets[i]);
          };
        }
      } else {
          if (addressParts[addressParts.length - 1].replace(/([a-zA-ZåäöÅÄÖ]+)/, '') === streetNumber) {
            resultStreets.push(streets[i]);
        }
      }
    }
    
    res.send(calculateWhen(resultStreets));
  });
});

function sortWeek() {
  const day = new Date().getDay()
  let sortedWeek = weekdayArr.slice()
  sortedWeek.push(...sortedWeek.splice(0,day))
  return sortedWeek;
}

function calculateWhen(results) {
  const resultsArr = [];
  
  for (let i = 0; i < 7; i++) {
    if(results[i] && results[i].properties.START_WEEKDAY === sortWeek()[0] ){
      resultsArr.push(`Här får du inte parkera idag mellan ${results[i].properties.START_TIME} och ${results[i].properties.END_TIME}`)
    }
    if(results[i] && results[i].properties.START_WEEKDAY === sortWeek()[1] ){
      resultsArr.push(`Här får du inte parkera imorgon mellan ${results[i].properties.START_TIME} och ${results[i].properties.END_TIME}`)
    }
    if(results[i] && results[i].properties.START_WEEKDAY === sortWeek()[2] ){
      resultsArr.push(`Här får du inte parkera ${sortWeek()[2]} mellan ${results[i].properties.START_TIME} och ${results[i].properties.END_TIME}`)
    }
    if(results[i] && results[i].properties.START_WEEKDAY === sortWeek()[3] ){
      resultsArr.push(`Här får du inte parkera ${sortWeek()[3]} mellan ${results[i].properties.START_TIME} och ${results[i].properties.END_TIME}`)
    }
    if(results[i] && results[i].properties.START_WEEKDAY === sortWeek()[4] ){
      resultsArr.push(`Här får du inte parkera ${sortWeek()[4]} mellan ${results[i].properties.START_TIME} och ${results[i].properties.END_TIME}`)
    }
    if(results[i] && results[i].properties.START_WEEKDAY === sortWeek()[5] ){
      resultsArr.push(`Här får du inte parkera ${sortWeek()[5]} mellan ${results[i].properties.START_TIME} och ${results[i].properties.END_TIME}`)
    }
    if(results[i] && results[i].properties.START_WEEKDAY === sortWeek()[6] ){
      resultsArr.push(`Här får du inte parkera ${sortWeek()[6]} mellan ${results[i].properties.START_TIME} och ${results[i].properties.END_TIME}`)
    }
  }
  return resultsArr;
}

app.listen(8080, () => console.log('server running on port 8080'));
