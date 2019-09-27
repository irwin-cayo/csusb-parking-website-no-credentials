var id = [];
var response;
var counts = document.querySelectorAll(".count");
var baseURL = "https://csusb-parking.appspot.com/api/parking/locations/id";

function httpAsync(requestUrl, callFunc, id="") {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callFunc(this, id);            // function to be called once request finished and response (this) is ready
        }
    }
    xmlHttp.open("GET", requestUrl, true); // initializes a newly-created request, or re-initializes an existing one. 
    xmlHttp.send();                        // Sends the request
}

function showCount(xmlHttp, id){
    response = JSON.parse(xmlHttp.responseText);
    let count = response['max_capacity'] - response['capacity_count']
    if (count < 0)
        count = 0
    if (count > response['max_capacity'])
        count = response['max_capacity']   
    id.innerHTML = count
}

function pollCount(domElement){
    url = baseURL.replace("id", domElement.id)
    httpAsync(url, showCount, domElement);
    setTimeout(pollCount, 30000, domElement);
}

counts.forEach(function(domElement){
    pollCount(domElement);
});