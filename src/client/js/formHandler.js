


const dropdown = document.getElementById('country-dropdown');

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

function addCurrentDate(){
    const date = new Date();   
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    document.getElementById('startdate').setAttribute("value", y +'-'+ m +'-'+ d);
    console.log(d +'-'+ m +'-'+ y);
}
	
   



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


function resetForm(){
    document.getElementById('answer').style.display = 'none';
    document.getElementById('question').style.display = 'block';
    document.getElementById('postalcode').value = '';
}

function handleSubmit(event) {
    event.preventDefault()
    console.log('handleSubmit');

    const baseURL = "/travel";
    let postalcodeInput = document.getElementById('postalcode').value; 
    let countryInput = document.getElementById('country-dropdown').value; 
    fetch(baseURL, { 
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({postalcode: postalcodeInput, countrycode: countryInput}) // add postalcode to /sentime body
    })
    .then(res => res.json()) 
    .then(function (res) { 
        if(res.error == 'postalcode'){
            alert('Please choose a country ')
        } else if(res.error == 'postalcode'){
            alert('postal code does not match with a country the country !')
        } else {
            console.log(res);
        }
        // document.getElementById('date').innerHTML = allData[lastItem].date;
    })
    .catch((error) => {
        console.log("error : ", error);
    })

}

export { resetForm }
export { handleSubmit }
export { createCountrySelection }




