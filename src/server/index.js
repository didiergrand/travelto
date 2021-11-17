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

// Get api keys
const PixabayApiKey = process.env.Pixabay_API_KEY;
const weatherbitApiKey = process.env.weatherbit_API_KEY;
const geonamesUserName = process.env.geonames_USER_NAME;

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
    const cityname = req.body.cityname;
    const startdate = req.body.startdate;
    const countrycode = req.body.countrycode;
    const geonames_url = `http://api.geonames.org/searchJSON?name_equals=${cityname}&country=${countrycode}&maxRows=10&username=${geonamesUserName}`;    

    const geonames_response = await fetch(geonames_url);
    const geonames_data = await geonames_response.json();

    if (geonames_response.status !== 200){
        console.log('api error !');
    } else if(countrycode=='0'){
        console.log('countrycode error');
        weatherData = {
            'error' : 'countrycode'
        }
    }  else  if (geonames_data.geonames==0) {
        console.log('cityname error');
        weatherData = {
            'error' : 'cityname'
        }
    
    } else {
        const lat = geonames_data.geonames[0].lat;
        const lng = geonames_data.geonames[0].lng;
        const city = geonames_data.geonames[0].Name;
        const state = geonames_data.geonames[0].adminName1;
        const country = geonames_data.geonames[0].countryName;

        // Weatherbit
        const weatherbit_url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&valid_date=${startdate}&key=${weatherbitApiKey}`;
        const weatherbit_response = await fetch(weatherbit_url);
        const weatherbit_data = await weatherbit_response.json();

        // // Pixabay

        let pixabay_url = `https://pixabay.com/api/?key=${PixabayApiKey}&q=${cityname}+${country}&orientation=horizontal&image_type=photo`;
        let pixabay_response = await fetch(pixabay_url);
        let pixabay_data = await pixabay_response.json();

        if(pixabay_data.total == 0){
            pixabay_url = `https://pixabay.com/api/?key=${PixabayApiKey}&q=${state}+${country}&orientation=horizontal&image_type=photo`;
            pixabay_response = await fetch(pixabay_url);
            pixabay_data = await pixabay_response.json();
        }
        if(pixabay_data.total == 0){
            pixabay_url = `https://pixabay.com/api/?key=${PixabayApiKey}&q=${country}&orientation=horizontal&image_type=photo`;
            pixabay_response = await fetch(pixabay_url);
            pixabay_data = await pixabay_response.json();
        }
        if(pixabay_data.total == 0){
            pixabay_url = `https://pixabay.com/api/?key=${PixabayApiKey}&q=world&orientation=horizontal&image_type=photo`;
            pixabay_response = await fetch(pixabay_url);
            pixabay_data = await pixabay_response.json();
        }
        let randomImage = Math.floor(Math.random() * pixabay_data.hits.length);
        let pixabay_images = pixabay_data.hits[randomImage];
   
        weatherData = {
            'startdate':startdate,
            'cityname': cityname,
            'city': city,
            'state': state,
            'country': country,
            'weather': weatherbit_data.data[0],
            'imageL':pixabay_images.largeImageURL
        }
    }
    res.json(weatherData);

});