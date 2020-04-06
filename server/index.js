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

let coll = 'Hej'; //Change name

const timeBetweenDatabaseFill = 86400000;

getApiData();

setInterval(() => getApiData(), timeBetweenDatabaseFill);

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

app.get('/api/adresses/:adress', async (req,res) => {
  
  let streetName = req.params.adress.match(/([a-zA-ZåäöÅÄÖ]+)/)[0];
  const streetNumber = req.params.adress.match(/([0-9]+)/)[0];

  //streetName = streetName.toLowerCase().charAt(0).toUpperCase() solve first char to uppercase
  console.log(streetName);
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

app.get('/api/regions/:region', async (req,res) => {
  
  const lat = req.params.region.split(',')[0]
  const long = req.params.region.split(',')[1]
  
  const locUrl = `https://openparking.stockholm.se/LTF-Tolken/v1/servicedagar/within?radius=300&lat=${lat}&lng=${long}&maxFeatures=50&outputFormat=json&apiKey=231ca8a9-dc1a-41b7-a06f-87f61d585f1a`

  const response = await axios.get(locUrl).catch((error) => console.log(error))
  const responses = []
  for (let i = 0; i < response.data.features.length; i++) {
    const coordinates = []
    for (let j = 0; j < response.data.features[i].geometry.coordinates.length; j++) {
      coordinates.push(
        {
        latitude: response.data.features[i].geometry.coordinates[j][1],
        longitude: response.data.features[i].geometry.coordinates[j][0],
      })
    }
    responses.push(coordinates);
  }
  res.send(responses);
});

function sortWeek() {
  const day = new Date().getDay()
  let sortedWeek = weekdayArr.slice()
  sortedWeek.push(...sortedWeek.splice(0,day))
  return sortedWeek;
}

function calculateWhen(results) {
  const resultsArr = [];
  const daysIndex = [];
  let startTimeHours;
  let startTimeMin;
  let endTimeHours;
  let endTimeMin;
  let startTimeObject;
  let endTimeObject;
  let durationObj;
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
        daysIndex.push(sortWeek()[i])
        let nowTimeObj = new Date()
        startTimeObject.setDate(startTimeObject.getDate() + sortWeek().indexOf(daysIndex[0]))
        endTimeObject.setDate(endTimeObject.getDate() + sortWeek().indexOf(daysIndex[0]))
        nowTimeObj.setHours(new Date().getHours()+2,new Date().getMinutes());

        if (endTimeObject > nowTimeObj && startTimeObject < nowTimeObj ) {
             durationObj = duration(nowTimeObj,endTimeObject)
             resultsArr.push({
               startTimeObject, 
               endTimeObject, 
               day: 'idag', 
               hours: startTimeObject.getHours() - 2,
               minutes: startTimeObject.getMinutes()
              });
             return resultsArr;
          }
          if (endTimeObject < nowTimeObj && sortWeek()[i] === sortWeek()[sortWeek().indexOf(daysIndex[0])]) {
            if (daysIndex.length === 1) {
              startTimeObject.setDate(startTimeObject.getDate() + sortWeek().indexOf(daysIndex[0]))
              durationObj = duration(nowTimeObj,startTimeObject)
              resultsArr.push({
                startTimeObject, 
                endTimeObject, 
                day: daysIndex[0],
                hours: startTimeObject.getHours() - 2,
                minutes: startTimeObject.getMinutes()
               });
              return resultsArr
            } else {
              startTimeObject.setDate(startTimeObject.getDate() + sortWeek().indexOf(daysIndex[1]))
              durationObj = duration(nowTimeObj,startTimeObject)
              resultsArr.push({
                startTimeObject, 
                endTimeObject, 
                day: daysIndex[1],
                hours: (startTimeObject.getHours() - 2),
                minutes: startTimeObject.getMinutes()
               });
              return resultsArr
            }
         }
        durationObj = duration(nowTimeObj,startTimeObject)
        // resultsArr.push(`Här får du inte parkera ${sortWeek()[i]} om ${durationObj.days} dagar, ${durationObj.hours} timmar och ${durationObj.minutes} minuter`)
        resultsArr.push({
          startTimeObject, 
          endTimeObject, 
          day: sortWeek()[i],
          hours: startTimeObject.getHours() - 2,
          minutes: startTimeObject.getMinutes()
         });
      }
    }
  }
  return resultsArr;
}

function duration(t0, t1){
  let d = (new Date(t1)) - (new Date(t0));
  let weekdays     = Math.floor(d/1000/60/60/24/7);
  let days         = Math.floor(d/1000/60/60/24 - weekdays*7);
  let hours        = Math.floor(d/1000/60/60    - weekdays*7*24            - days*24);
  let minutes      = Math.floor(d/1000/60       - weekdays*7*24*60         - days*24*60         - hours*60);
  let seconds      = Math.floor(d/1000          - weekdays*7*24*60*60      - days*24*60*60      - hours*60*60      - minutes*60);
  let milliseconds = Math.floor(d               - weekdays*7*24*60*60*1000 - days*24*60*60*1000 - hours*60*60*1000 - minutes*60*1000 - seconds*1000);
  let t = {};
  ['weekdays', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'].forEach(q=>{ if (eval(q)>0) { t[q] = eval(q); } });
  return t;
}
app.listen(8080, () => console.log('server running on port 8080'));
