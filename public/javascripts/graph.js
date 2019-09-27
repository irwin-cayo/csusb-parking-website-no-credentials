//Default would be current date
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

//Make changes here with API changes accordingly
//API currently only supports lot PKE
var urlQuery = 'https://csusb-parking.appspot.com/api/parking/locations/PKE/bigquery/?start=' + date + '&graph=1';

function showDay(xmlHttp){
    let response = JSON.parse(xmlHttp.responseText);
    let dates = [];
    let counts = [];
    for (let i = 0; i < Object.keys(response).length; i++) {
        dates.push(new Date(response[i.toString()]['timestamp'] * 1000));
        counts.push(response[i.toString()]['count']);
    }
    var ctx = document.getElementById('count-chart');
    let chart = new Chart(ctx, {
        type: 'line',
    // The data for our dataset
        data: {
            labels: dates,
            datasets: [{
                label: 'Count',
                backgroundColor: 'rgba(99,132,255,0.2)',
                borderColor: 'rgba(99,132,255,1)',
                borderWidth: 1,
                lineTension: 0,
                radius: 0,
                hoverBackgroundColor: 'rgba(99,132,255,0.4)',
                hoverBorderColor: 'rgba(99,132,255,1)',
                data: counts
            }]
        },

        // Configuration options
        options: {
            elements: {
                line: {
                    tension: 0
                }
            },
            maintainAspectRatio: false,
            hover: {
                mode: 'nearest',
                animationDuration: 0
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 745,
                        fontFamily: "'Interstate', 'Arial', 'Helvetica', sans-serif;"
                    },
                    stacked: false,
                    gridLines: {
                        display: true,
                        color: 'rgba(255, 99, 132, 0.2)'
                    },
                animation: false,
                hover: {
                    mode: 'nearest',
                    animationDuration: 0
                },
                responsiveAnimationDuration: 0,
                elements: {
                    line: {
                        tension: 0
                    }
                }
                }],
                xAxes: [{
                    gridLines: {
                        display: true,
                    },
                    type: 'time',
                    time: {
                        unit: 'hour',
                        min: '',
                        distribution: 'series',
                        unitStepSize: 2,
                    },
                    ticks: {
                        source: "auto"
                    }
                }]
            }

        }
    });
}

//a template string is used. {id} is api url endpoint  
var loc = document.querySelector("h1").id;
var url = `https://csusb-parking.appspot.com/api/parking/locations/${loc}`;

function httpAsync(requestUrl, callFunc) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callFunc(this);                // function to be called once request finished and response (this) is ready
        }
    }
    xmlHttp.open("GET", requestUrl, true); // initializes a newly-created request, or re-initializes an existing one. 
    xmlHttp.send();                        // Sends the request
}

function updateDom(xmlHttp){
    var response = JSON.parse(xmlHttp.responseText);
    //count range 0-max_capacity
    let available = response['max_capacity'] - response['capacity_count']
    if (available < 0)
        available = 0
    if (available > response['max_capacity'])
        available = response['max_capacity']
    document.querySelector("#occupancy").innerHTML = response['capacity_count'];
    document.querySelector("#max").innerHTML = response['max_capacity'];
    document.querySelector("#available").innerHTML = available;
    var date = new Date(response['capacity_timestamp_raw'] * 1000);
    document.querySelector("#timestamp").innerHTML = date.toLocaleString();
}
function pollCount(){
    httpAsync(url, updateDom);
    setTimeout(pollCount, 60000);
}

function pollChart(){
    httpAsync(urlQuery, showDay);
    setTimeout(pollChart, 60000);
}

function chartConfig(maxOccupancy){
    Chart.scaleService.updateScaleDefaults('linear', {
        ticks: {
            max: maxOccupancy
        }
    });
}

pollCount();
//chartConfig(750);
pollChart();

