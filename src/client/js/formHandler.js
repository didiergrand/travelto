


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
    .catch((error) => {
        console.log("error : ", error);
    });
   

function createCountrySelection(data){
     
    dropdown.length = 0;

    const defaultOption = document.createElement('option');
    defaultOption.text = '- Choose country -';

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
    var tmpAry = new Array();
    for (var i=0;i<selElem.options.length;i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selElem.options[i].text;
        tmpAry[i][1] = selElem.options[i].value;
    }
    tmpAry.sort();
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    for (var i=0;i<tmpAry.length;i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
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

    const baseURL = "/travel";
    const postalcodeInput = document.getElementById('postalcode').value; 
    const countryInput = document.getElementById('country-dropdown').value; 
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
        console.log(res);
    })
    .catch((error) => {
        console.log("error : ", error);
    })

}

export { resetForm }
export { handleSubmit }
export { createCountrySelection }




