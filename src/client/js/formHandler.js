const dropdown = document.getElementById('country-dropdown');

if (dropdown) {
    const baseURL = "/countrycodes";
    fetch(baseURL, { 
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: { 
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json()) 
    .then(function (res) { 
        createCountrySelection(res);
    })
    .then(function () { 
        sortSelect(dropdown);
    })
    .then(function () { 
        addCurrentDate();
    })
    .catch((error) => {
        console.log("error : ", error);
    });
}
// Add current date to the input date field
function addCurrentDate(){
    const date = new Date();   
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    document.getElementById('startdate').setAttribute("value", y +'-'+ m +'-'+ d);
}

// convert date from 2021-11-17 to November 17, 2021
function niceDate(date){
    const dateparts = date.split('-');
    const monthName = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    
    const datey = dateparts[0];
    const datem = monthName[dateparts[1]-1];
    const dated = dateparts[2];

    const newdate = datem +" "+ dated +", "+ datey;
    return newdate
}
	
// Create a dropdown for the country selection
function createCountrySelection(data){
     
    dropdown.length = 0;

    const defaultOption = document.createElement('option');
    defaultOption.text = '- Choose country -';
    defaultOption.value = '0';

    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;
    const countryCount = Object.keys(data).length;
    for (var i = 0; i < countryCount; i++) {

        let countryCode = Object.keys(data)[i];
        let countryName = Object.values(data)[i];

        let option = document.createElement('option');
        option.text = countryName;
        option.value = countryCode;
        dropdown.add(option);
    }   
}

// Order the country by name / alphabetically order
function sortSelect(selElem) {
    let tmpAry = new Array();
    for (let i=0;i<selElem.options.length;i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selElem.options[i].text;
        tmpAry[i][1] = selElem.options[i].value;
    }
    tmpAry.sort();
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    for (let i=0;i<tmpAry.length;i++) {
        let op = new Option(tmpAry[i][0], tmpAry[i][1]);
        selElem.options[i] = op;
    }
    return;
}

// reset the form when we click on the button "choose another destination"
function resetForm(){
    document.getElementById('answer').style.display = 'none';
    document.getElementById('question').style.display = 'grid';
    document.getElementById('city-error').style.display = 'none';
    document.getElementById('country-error').style.display = 'none';
}

// convert the weather code from weatherbit API to the svg icon name
function getWeatherIcon(weatherCode){
    fetch('../assets/mapping.json')
    .then(res => res.json()) 
    .then(function (res) { 
        document.getElementById('res_weathericon').innerHTML = '<img src="/images/weather/'+res[weatherCode]+'.svg">';
    })
    .catch((error) => {
        console.log("error : ", error);
    })
}

// get the data from form // display the result on the view
function handleSubmit(event) {
    event.preventDefault();
    let citynameInput = document.getElementById('cityname').value; 
    let startDateInput = document.getElementById('startdate').value; 
    let countryInput = document.getElementById('country-dropdown').value; 

    const baseURL = "/travel";
    fetch(baseURL, { 
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({cityname: citynameInput, startdate: startDateInput, countrycode: countryInput}) // add cityname to /sentime body
    })
    .then(res => res.json()) 
    .then(function (res) { 
        if(res.error == 'countrycode'){
            document.getElementById('country-error').style.display = 'block';
        } else if(res.error == 'cityname'){
            document.getElementById('city-error').style.display = 'block';
        } else {
            document.getElementById('res_startdate').innerHTML =  niceDate(res.startdate);
            document.getElementById('res_cityname').innerHTML = res.cityname;
            document.getElementById('res_country').innerHTML = res.country;
            document.getElementById('answer').style.backgroundImage = 'url("'+res.imageL+'")';
            document.getElementById('res_weathertemp').innerHTML = res.weather.temp;
            document.getElementById('res_weatherdescription').innerHTML = res.weather.weather.description;
            const weatherCode = "wb"+res.weather.weather.code;
            getWeatherIcon(weatherCode); 

            document.getElementById('answer').style.display = 'block';
            document.getElementById('question').style.display = 'none';
        }
    })
    .catch((error) => {
        console.log("error : ", error);
    })

}

export { resetForm }
export { handleSubmit }
export { createCountrySelection }