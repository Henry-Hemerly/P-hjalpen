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
  let startTimeHours;
  let startTimeMin;
  let endTimeHours;
  let endTimeMin;
  let startTimeObject;
  let endTimeObject;
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < results.length; j++) {
      if(results[j] && results[j].properties.START_WEEKDAY === sortWeek()[i] ){
        let startTimeString = results[j].properties.START_TIME.toString();
        let endTimeString = results[j].properties.END_TIME.toString();
        if(startTimeString.length === 3 ){
          startTimeHours = parseInt(startTimeString.substring(0,1));
          startTimeMin = parseInt(startTimeString.substring(1));
          startTimeObject = new Date();
          startTimeObject.setHours(startTimeHours+2,startTimeMin);
        }
        if(endTimeString.length ===  3){
          endTimeHours = parseInt(endTimeString.substring(0,1));
          endTimeMin = parseInt(endTimeString.substring(1));
          endTimeObject = new Date();
          endTimeObject.setHours(endTimeHours+2,endTimeMin)
        }
        if(startTimeString.length ===  4){
          startTimeHours = parseInt(startTimeString.substring(0,2));
          startTimeMin = parseInt(startTimeString.substring(2));
          console.log(startTimeHours,startTimeMin);
          startTimeObject = new Date();
          startTimeObject.setHours(startTimeHours+2,startTimeMin);
        }
        if(endTimeString.length ===  4){
          endTimeHours = parseInt(endTimeString.substring(0,2));
          endTimeMin = parseInt(endTimeString.substring(2));
          endTimeObject = new Date();
          endTimeObject.setHours(endTimeHours+2,endTimeMin)
        }
        if(startTimeString.length ===  1){
          startTimeHours = parseInt(startTimeString.substring(0,1));
          console.log(startTimeHours);
          startTimeObject = new Date();
          startTimeObject.setHours(startTimeHours+2,0);
        }
        if(endTimeString.length ===  1){
          endTimeHours = parseInt(endTimeString.substring(0,1));
          endTimeObject = new Date();
          endTimeObject.setHours(endTimeHours+2,0)
        }
        console.log("start",startTimeObject);
        console.log("end",endTimeObject);
        let nowTimeObj = new Date()
        nowTimeObj.setHours(new Date().getHours()+2,new Date().getMinutes());
        console.log("Today", nowTimeObj)
        resultsArr.push(`Här får du inte parkera ${sortWeek()[i]} mellan ${results[j].properties.START_TIME} och ${results[j].properties.END_TIME}`)
      }
    }
  }
  return resultsArr;
}

app.listen(8080, () => console.log('server running on port 8080'));
