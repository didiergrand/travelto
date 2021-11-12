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
    let countryname_url = 'http://country.io/names.json';
    let countryname_response = await fetch(countryname_url);
    let countryname_data = await countryname_response.json();
    
    res.json(countryname_data);
});

app.post('/travel', async (req, res) => { // send data
    let postalcode = req.body.postalcode;
    let countrycode = req.body.countrycode;
    console.log("postalcode: "+postalcode);
    console.log("countrycode: "+countrycode);
    let geonames_url = `http://api.geonames.org/postalCodeSearchJSON?postalcode=${postalcode}&country=${countrycode}&maxRows=10&username=dgrand`;    
    let geonames_response = await fetch(geonames_url);
    let geonames_data = await geonames_response.json()
    if(countrycode=='0'){
        console.log('countrycode error');
        weatherData = {
            'error' : 'countrycode'
        }
    }  else if (geonames_response.status !== 200){
        console.log(geonames_response.status);
        console.log('api error !');
    } else if (geonames_data.postalCodes==0 || postalcode=='' ) {
        console.log('postalcode error');
        weatherData = {
            'error' : 'postalcode'
        }
    } else  {

        let lat = geonames_data.postalCodes[0].lat;
        let lng = geonames_data.postalCodes[0].lng;
        let city = geonames_data.postalCodes[0].placeName;
        let state = geonames_data.postalCodes[0].adminName1;
        let country = geonames_data.postalCodes[0].countryCode;

        // Weatherbit
        
        let weatherbit_url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=3f05c0bfc4eb40f1847219f323a7f951`;
        let weatherbit_response = await fetch(weatherbit_url);
        let weatherbit_data = await weatherbit_response.json();

        // Country

        let countryname_url = `http://country.io/names.json`;
        let countryname_response = await fetch(countryname_url);
        let countryname_data = await countryname_response.json();
        let countryname = countryname_data[country];

        // Pixabay

        let pixabay_url = `https://pixabay.com/api/?key=5442229-dc0066f9aae76d8988cf4f6ec&q=${city}+${countryname}&image_type=photo`;
        let pixabay_response = await fetch(pixabay_url);
        let pixabay_data = await pixabay_response.json();
        //console.log(pixabay_data);

        if(pixabay_data.total == 0){
            let pixabay_url = `https://pixabay.com/api/?key=5442229-dc0066f9aae76d8988cf4f6ec&q=${state}+${countryname}&image_type=photo`;
            let pixabay_response = await fetch(pixabay_url);
            let pixabay_data = await pixabay_response.json();
            //console.log(pixabay_data);
        }
        if(pixabay_data.total == 0){
            let pixabay_url = `https://pixabay.com/api/?key=5442229-dc0066f9aae76d8988cf4f6ec&q=${countryname}&image_type=photo`;
            let pixabay_response = await fetch(pixabay_url);
            let pixabay_data = await pixabay_response.json();
            //console.log(pixabay_data);
        }

        weatherData = {
            'postalcode': postalcode,
            'city': geonames_data.postalCodes[0].placeName,
            'state': geonames_data.postalCodes[0].adminName1,
            'country': geonames_data.postalCodes[0].countryCode,
            'weather': weatherbit_data.data[0]
        }
        
    }
    res.json(weatherData);

});