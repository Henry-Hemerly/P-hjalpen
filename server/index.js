const express = require('express');
const app = express();
const axios = require('axios');

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
