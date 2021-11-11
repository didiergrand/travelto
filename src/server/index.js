const dotenv = require('dotenv');
dotenv.config();

const fetch = require('node-fetch')

var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')



//Express
const app = express()
app.use(express.static('dist'))

//Body-Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Cors
const cors = require('cors');
app.use(cors());

const apiKey = process.env.API_KEY;

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
}) 

const port = 8082;

app.listen(port, function () {
    console.log(`Travel app listening on port ${port}!`)
});

app.post('/countrycodes', async (req, res) => { 
    const countryname_url = 'http://country.io/names.json';
    const countryname_response = await fetch(countryname_url);
    const countryname_data = await countryname_response.json();
    
    res.json(countryname_data);
});

app.post('/travel', async (req, res) => { // send data
    const postalcode = req.body.postalcode;
    const countrycode = req.body.countrycode;
    
    const geonames_url = `http://api.geonames.org/postalCodeSearchJSON?postalcode=${postalcode}&country=${countrycode}&maxRows=10&username=dgrand`;    
    const geonames_response = await fetch(geonames_url);
    const geonames_data = await geonames_response.json();

    const lat = geonames_data.postalCodes[0].lat;
    const lng = geonames_data.postalCodes[0].lng;
    const city = geonames_data.postalCodes[0].placeName;
    const state = geonames_data.postalCodes[0].adminName1;
    const country = geonames_data.postalCodes[0].countryCode;

    // Weatherbit
    
    const weatherbit_url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=3f05c0bfc4eb40f1847219f323a7f951`;
    const weatherbit_response = await fetch(weatherbit_url);
    const weatherbit_data = await weatherbit_response.json();

    // Country

    const countryname_url = `http://country.io/names.json`;
    const countryname_response = await fetch(countryname_url);
    const countryname_data = await countryname_response.json();
    const countryname = countryname_data[country];

    // Pixabay

    const pixabay_url = `https://pixabay.com/api/?key=5442229-dc0066f9aae76d8988cf4f6ec&q=${city}+${countryname}&image_type=photo`;
    const pixabay_response = await fetch(pixabay_url);
    const pixabay_data = await pixabay_response.json();
    //console.log(pixabay_data);

    if(pixabay_data.total == 0){
        const pixabay_url = `https://pixabay.com/api/?key=5442229-dc0066f9aae76d8988cf4f6ec&q=${state}+${countryname}&image_type=photo`;
        const pixabay_response = await fetch(pixabay_url);
        const pixabay_data = await pixabay_response.json();
        //console.log(pixabay_data);
    }
    if(pixabay_data.total == 0){
        const pixabay_url = `https://pixabay.com/api/?key=5442229-dc0066f9aae76d8988cf4f6ec&q=${countryname}&image_type=photo`;
        const pixabay_response = await fetch(pixabay_url);
        const pixabay_data = await pixabay_response.json();
        //console.log(pixabay_data);
    }

    weatherData = {
        'postalcode': postalcode,
        'city': geonames_data.postalCodes[0].placeName,
        'state': geonames_data.postalCodes[0].adminName1,
        'country': geonames_data.postalCodes[0].countryCode,
        'weather': weatherbit_data.data[0]
    }
    
    res.json(weatherData);

});