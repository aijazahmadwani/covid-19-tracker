// GET USER REGION DETAILS
async function getUserRegionCode() {
    const response = await fetch("https://ipapi.co/json");
    const data = await response.json();
    return data;
}
getUserRegionCode().then(res => {
    const district = res.city;
    const stateCode = 'IN-' + res.region_code;
    getData().then(res => {
        res.forEach((state) => {
            if (state.id == stateCode) {
                console.log(state.id);
                console.log(state);
                console.log(state.confirmed);
                console.log(state.active);
                console.log(state.recovered);
                console.log(state.deaths);
                console.log(state.districtData)
                state.districtData.forEach((dist) => {
                    if (dist.id == district) {
                        console.log(dist.id)
                        console.log(dist.confirmed);
                    }
                });
            }
        });
    });
})



async function getData() {
    const response = await fetch('https://api.covidindiatracker.com/state_data.json');
    const data = await response.json();
    return data
}

// getData().then(response => {
//   
// });
