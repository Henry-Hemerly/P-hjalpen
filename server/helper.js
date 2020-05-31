const weekdayArr = [
  'söndag',
  'måndag',
  'tisdag',
  'onsdag',
  'torsdag',
  'fredag',
  'lördag',
];

function sortWeek() {
  const day = new Date().getDay();
  let sortedWeek = weekdayArr.slice();
  sortedWeek.push(...sortedWeek.splice(0, day));
  return sortedWeek;
}

function formatHoursAndMinutes(digit) {
  if (digit.toString().length === 2) {
    return digit;
  } else if (digit.toString().length === 1) {
    return '0' + digit;
  }
}

function duration(t0, t1) {
  let d = new Date(t1) - new Date(t0);
  let weekdays = Math.floor(d / 1000 / 60 / 60 / 24 / 7);
  let days = Math.floor(d / 1000 / 60 / 60 / 24 - weekdays * 7);
  let hours = Math.floor(d / 1000 / 60 / 60 - weekdays * 7 * 24 - days * 24);
  let minutes = Math.floor(
    d / 1000 / 60 - weekdays * 7 * 24 * 60 - days * 24 * 60 - hours * 60
  );
  let seconds = Math.floor(
    d / 1000 -
      weekdays * 7 * 24 * 60 * 60 -
      days * 24 * 60 * 60 -
      hours * 60 * 60 -
      minutes * 60
  );
  let milliseconds = Math.floor(
    d -
      weekdays * 7 * 24 * 60 * 60 * 1000 -
      days * 24 * 60 * 60 * 1000 -
      hours * 60 * 60 * 1000 -
      minutes * 60 * 1000 -
      seconds * 1000
  );
  let t = {};
  ['weekdays', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'].forEach(
    (q) => {
      if (eval(q) > 0) {
        t[q] = eval(q);
      }
    }
  );
  return t;
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
  let cityDistrict;
  let parkingDistrict;

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < results.length; j++) {
      cityDistrict = results[j].properties.CITY_DISTRICT;
      parkingDistrict = results[j].properties.PARKING_DISTRICT;

      if (results[j] && results[j].properties.START_WEEKDAY === sortWeek()[i]) {
        let startTimeString = results[j].properties.START_TIME.toString();
        let endTimeString = results[j].properties.END_TIME.toString();

        if (startTimeString.length === 3) {
          startTimeHours = parseInt(startTimeString.substring(0, 1));
          startTimeMin = parseInt(startTimeString.substring(1));
          startTimeObject = new Date();
          startTimeObject.setHours(startTimeHours + 2, startTimeMin);
        }
        if (endTimeString.length === 3) {
          endTimeHours = parseInt(endTimeString.substring(0, 1));
          endTimeMin = parseInt(endTimeString.substring(1));
          endTimeObject = new Date();
          endTimeObject.setHours(endTimeHours + 2, endTimeMin);
        }
        if (startTimeString.length === 4) {
          startTimeHours = parseInt(startTimeString.substring(0, 2));
          startTimeMin = parseInt(startTimeString.substring(2));
          startTimeObject = new Date();
          startTimeObject.setHours(startTimeHours + 2, startTimeMin);
        }
        if (endTimeString.length === 4) {
          endTimeHours = parseInt(endTimeString.substring(0, 2));
          endTimeMin = parseInt(endTimeString.substring(2));
          endTimeObject = new Date();
          endTimeObject.setHours(endTimeHours + 2, endTimeMin);
        }
        if (startTimeString.length === 1) {
          startTimeHours = parseInt(startTimeString.substring(0, 1));
          startTimeObject = new Date();
          startTimeObject.setHours(startTimeHours + 2, 0);
        }
        if (endTimeString.length === 1) {
          endTimeHours = parseInt(endTimeString.substring(0, 1));
          endTimeObject = new Date();
          endTimeObject.setHours(endTimeHours + 2, 0);
        }
        daysIndex.push(sortWeek()[i]);
        let nowTimeObj = new Date();
        startTimeObject.setDate(
          startTimeObject.getDate() + sortWeek().indexOf(daysIndex[0])
        );
        endTimeObject.setDate(
          endTimeObject.getDate() + sortWeek().indexOf(daysIndex[0])
        );
        nowTimeObj.setHours(new Date().getHours() + 2, new Date().getMinutes());
        //during
        if (endTimeObject > nowTimeObj && startTimeObject < nowTimeObj) {
          durationObj = duration(nowTimeObj, endTimeObject);
          resultsArr.push({
            startTimeObject,
            endTimeObject,
            day: 'idag',
            hours: formatHoursAndMinutes(startTimeObject.getHours() - 2),
            minutes: formatHoursAndMinutes(startTimeObject.getMinutes()),
            endHours: formatHoursAndMinutes(endTimeObject.getHours() - 2),
            endMinutes: formatHoursAndMinutes(endTimeObject.getMinutes()),
            cityDistrict,
            parkingDistrict,
            durationObj,
            onGoing: true,
          });
          return resultsArr;
        }
        if (
          endTimeObject < nowTimeObj &&
          sortWeek()[i] === sortWeek()[sortWeek().indexOf(daysIndex[0])]
        ) {
          if (daysIndex.length === 1) {
            startTimeObject.setDate(
              startTimeObject.getDate() + sortWeek().indexOf(daysIndex[0])
            );
            durationObj = duration(nowTimeObj, startTimeObject);
            resultsArr.push({
              startTimeObject,
              endTimeObject,
              day: daysIndex[0],
              hours: formatHoursAndMinutes(startTimeObject.getHours() - 2),
              minutes: formatHoursAndMinutes(startTimeObject.getMinutes()),
              endHours: formatHoursAndMinutes(endTimeObject.getHours() - 2),
              endMinutes: formatHoursAndMinutes(endTimeObject.getMinutes()),
              cityDistrict,
              parkingDistrict,
              durationObj,
              onGoing: false,
            });
            return resultsArr;
          } else {
            //time to start
            startTimeObject.setDate(
              startTimeObject.getDate() + sortWeek().indexOf(daysIndex[1])
            );
            durationObj = duration(nowTimeObj, startTimeObject);
            resultsArr.push({
              startTimeObject,
              endTimeObject,
              day: daysIndex[1],
              hours: formatHoursAndMinutes(startTimeObject.getHours() - 2),
              minutes: formatHoursAndMinutes(startTimeObject.getMinutes()),
              endHours: formatHoursAndMinutes(endTimeObject.getHours() - 2),
              endMinutes: formatHoursAndMinutes(endTimeObject.getMinutes()),
              cityDistrict,
              parkingDistrict,
              durationObj,
              onGoing: false,
            });
            return resultsArr;
          }
        } //time to start
        durationObj = duration(nowTimeObj, startTimeObject);
        resultsArr.push({
          startTimeObject,
          endTimeObject,
          day: sortWeek()[i],
          hours: formatHoursAndMinutes(startTimeObject.getHours() - 2),
          minutes: formatHoursAndMinutes(startTimeObject.getMinutes()),
          endHours: formatHoursAndMinutes(endTimeObject.getHours() - 2),
          endMinutes: formatHoursAndMinutes(endTimeObject.getMinutes()),
          cityDistrict,
          parkingDistrict,
          durationObj,
          onGoing: false,
        });
      }
    }
  }
  console.log('====================================');
  console.log(parkingDistrict);
  console.log('====================================');
  return resultsArr;
}

module.exports = { calculateWhen };
