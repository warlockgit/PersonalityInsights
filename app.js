const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');

//Contiene SDK con la cual se va a llevar acabo al ejecución
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var fs = require('fs');
//Archivo con datos de clasificacion
var Estructurador = require('./Estructurador');

//set IBM cloud credentials in this section
var personalityInsights = new PersonalityInsightsV3({
  version_date: '2017-10-13',
  username: 'apikey',
  password: 'IGNUgnmryem1Ie8A8onqv-uvbw9BMebcPxKxJZXJZ_2Y'
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });
// Init app para el back de la aplicacion
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.get('/upload', (req, res) => {
res.render('upload', {qs: req.query});
});
var x;
app.post('/upload', urlencodedParser ,(req, res) => {
  //here we already have req.body data
  // console.log(req.body);
  // console.log(typeof req.body);
  // console.log(JSON.stringify(req.body));
  // console.log(typeof JSON.stringify(typeof req.body));

  //Variable con informacion de contenido
var cont = JSON.stringify(req.body.p1 + req.body.p2 + req.body.p3 + req.body.p4 + req.body.p5);


var audaciaN;
console.log(cont);
  var profileParams = {
    // Get the content from the JSON file.

    content: cont,
    content_type: 'text/plain',
    consumption_preferences: true, //QUe traiga variables de consumo
    content_language: 'es',
    accept_language: 'es',
    raw_scores: true
  };
                                            //Callback function
  personalityInsights.profile(profileParams, function(error, profile) {
  if (error) {
    console.log(error);
  } else {
    //console.log(JSON.stringify(profile, null, 2));
    x = profile;
    var audaciaN = JSON.stringify(x.personality[0].children[0].name, null, 2);
    var audaciaP = JSON.stringify(x.personality[0].children[0].percentile, null, 2);
    var inAr = JSON.stringify(x.personality[0].children[1].name, null, 2);
    var inArP = JSON.stringify(x.personality[0].children[1].percentile, null, 2);
    var emocional = JSON.stringify(x.personality[1].children[2].name, null, 2);
    var emocionalP = JSON.stringify(x.personality[1].children[2].percentile, null, 2);
    var imagin = JSON.stringify(x.personality[0].children[3].name, null, 2);
    var imaginP = JSON.stringify(x.personality[0].children[3].percentile, null, 2);
    var intelec = JSON.stringify(x.personality[0].children[4].name, null, 2);
    var intelecP = JSON.stringify(x.personality[0].children[4].percentile, null, 2);
    
    //Limpiar el output para qye sea visiblemente entendible
    var y=Estructurador.cleansing(x);
    console.log(y);

  }
  res.render('profile', {
  au: audaciaN,
  aup: audaciaP,
  inar: inAr,
  inarp: inArP,
  emo: emocional,
  emoP:emocionalP,
  ima:imagin,
  imaP:imaginP,
  inte:intelec,
  intep:intelecP

    });//este es el view que se carga
});


});

const port = 8080;

app.listen(port, () => console.log(`Server started on port ${port}`));
