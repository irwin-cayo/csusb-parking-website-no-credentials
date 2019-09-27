const express = require("express");
const app = express();
var admin = require("firebase-admin");
var serviceAccount = require("./credentials/csusb-parking-firebase.json");

//firebase auth
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://csusb-parking.firebaseio.com"
  });

app.use(express.static('public'));
app.set('view engine', 'ejs');

//Get lot names from firebase
var db = admin.database();
var ref = db.ref("/testing/keys") //parking/list
var parkingLots;
ref.on("value", function(snapshot){
    parkingLots = snapshot.val()
});

//render index template with lots that are ready
app.get('/', function(req, res){
    res.render("index", {parkingStructures: parkingLots});
});

//render details of each parking lot
app.get('/details/:id', function(req, res){
    if (parkingLots.hasOwnProperty(req.params.id)){
        //Temporary
        if (req.params.id === 'PKE'){
            let lot = db.ref("/testing/locations/" + req.params.id)
            lot.once("value", function(snapshot){
                res.render("details", {lotVariables: snapshot.val(), location: req.params.id});
            });
        }
        else {
            res.send("Sorry this parking lot is not supported yet!")
        }
        //
        // let lot = db.ref("/parking/" + req.params.id)
        // lot.once("value", function(snapshot){
        //     res.render("details", {lotVariables: snapshot.val(), location: req.params.id});
        // });
    }
    else {
        res.send("That page does not exist!")
    }
});

// BRIAN ADDED THIS
const server = app.listen(8080, () => {
    const host = server.address().address;
    const port = server.address().port;
  
    console.log(`Example app listening at http://${host}:${port}`);
  });