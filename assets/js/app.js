
// SELECT ALL ELEMENTS
const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .new-value");

// STATE SPECIFIC
const state_name_element = document.querySelector(".state .name");
const state_total_cases_element = document.querySelector(".state .total-cases .value");
const state_recovered_element = document.querySelector(".state .recovered .value");
const state_deaths_element = document.querySelector(".state .deaths .value");
const state_active_element = document.querySelector(".state .active .value");
const district_name = document.querySelector(".district .title");
const district_total_cases = document.querySelector(".district-cases");

const ctx = document.getElementById("axes_line_chart").getContext("2d");


// APP VARIABLES
let app_data = [],
  cases_list = [],
  recovered_list = [],
  deaths_list = [],
  deaths = [],
  formatedDates = [];

// GET USERS COUNTRY CODE
let country_code;
let user_country;
async function getUserCountryCode() {
  const response = await fetch("https://ipapi.co/json")
  const data = await response.json();
  return data.country_code;
}

getUserCountryCode().then(res => {
  country_code = res;
  country_list.forEach((country) => {
    if (country.code == country_code) {
      user_country = country.name;
    }
  });
  fetchData(user_country);
});




/* ---------------------------------------------- */
/*                     FETCH API                  */
/* ---------------------------------------------- */
function fetchData(country) {
  user_country = country;
  country_name_element.innerHTML = "Loading...";

  (cases_list = []),
    (recovered_list = []),
    (deaths_list = []),
    (dates = []),
    (formatedDates = []);

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const api_fetch = async (country) => {
    await fetch(
      "https://api.covid19api.com/total/country/" +
      country +
      "/status/confirmed",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          dates.push(entry.Date);
          cases_list.push(entry.Cases);
        });
      });

    await fetch(
      "https://api.covid19api.com/total/country/" +
      country +
      "/status/recovered",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          recovered_list.push(entry.Cases);
        });
      });

    await fetch(
      "https://api.covid19api.com/total/country/" + country + "/status/deaths",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          deaths_list.push(entry.Cases);
        });
      });

    updateUI();
  };

  api_fetch(country);
}



// UPDATE UI FUNCTION
function updateUI() {
  updateStats();
  axesLinearChart();
}

function updateStats() {
  const total_cases = cases_list[cases_list.length - 1];
  const new_confirmed_cases = total_cases - cases_list[cases_list.length - 2];

  const total_recovered = recovered_list[recovered_list.length - 1];
  const new_recovered_cases =
    total_recovered - recovered_list[recovered_list.length - 2];

  const total_deaths = deaths_list[deaths_list.length - 1];
  const new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2];

  country_name_element.innerHTML = user_country;
  total_cases_element.innerHTML = total_cases;
  new_cases_element.innerHTML = `+${new_confirmed_cases}`;
  recovered_element.innerHTML = total_recovered;
  new_recovered_element.innerHTML = `+${new_recovered_cases}`;
  deaths_element.innerHTML = total_deaths;
  new_deaths_element.innerHTML = `+${new_deaths_cases}`;

  // format dates
  dates.forEach((date) => {
    formatedDates.push(formatDate(date));
  });
}

// UPDATE CHART
let my_chart;
function axesLinearChart() {
  if (my_chart) {
    my_chart.destroy();
  }

  my_chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Cases",
          data: cases_list,
          fill: false,
          borderColor: "#FFF",
          backgroundColor: "#FFF",
          borderWidth: 1,
        },
        {
          label: "Recovered",
          data: recovered_list,
          fill: false,
          borderColor: "#009688",
          backgroundColor: "#009688",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: deaths_list,
          fill: false,
          borderColor: "#f44336",
          backgroundColor: "#f44336",
          borderWidth: 1,
        },
      ],
      labels: formatedDates,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// FORMAT DATES
const monthsNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(dateString) {
  let date = new Date(dateString);

  return `${date.getDate()} ${monthsNames[date.getMonth() - 1]}`;
}


// STATE SPECIFIC 


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
        state_name_element.innerHTML = state.state;
        state_total_cases_element.innerHTML = state.confirmed;
        state_recovered_element.innerHTML = state.recovered;
        state_deaths_element.innerHTML = state.deaths;
        state_active_element.innerHTML = state.active;
        state.districtData.forEach((dist) => {
          if (dist.id == district) {
            district_name.innerHTML = dist.id;
            district_total_cases.innerHTML = dist.confirmed;
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


