/*

Time of the Game (node.js)
The Office For Creative Research
July, 2014

https://github.com/blprnt/timeofthegame

*/

var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    fs = require('fs')

var app = express();
var query = 'sandwich';

var scraper = require('scraper.js');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
//app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

//Start the server
app.get('/', function (req, res) {
  var j = collectJSON(res);
  
})

app.get('/skewtool', function (req, res) {
  var l = getUntagged(res);
  
})

app.get('/report/:id/:coords', function (req, res) {
  var l = getUntagged(res);
  console.log("GOT UPDATE:" + req.params.id + ":   " + req.params.coords );
})

app.listen(24702)
console.log("Listening on " + 24702)

//Start the scraper
//scraper.init(query);

//Get the most recent untagged JSON
function getUntagged(res) {

  var path = require('path'),
  appDir = path.dirname(require.main.filename);
  console.log("APP DIR " + appDir)

  var files = fs.readdirSync(appDir + '/public/out/' + query + '/data');
  var out;
  for (var i = 0; i < files.length; i++) {
    var fj = JSON.parse(fs.readFileSync(appDir + '/public/out/' + query + '/data/' + files[i], "utf8"));
    if (!fj.corners) out = fj;
    break;
  }
  res.render('skewtool',
  { title : 'SkewTool', defImage:out }
  )
}

//Get the full JSON from the directory
function collectJSON(res) {
  var files = fs.readdirSync(__dirname + '/out/' + query + '/data');
  var outs = [];
  for (var i = 0; i < files.length; i++) {
    var fj = JSON.parse(fs.readFileSync(__dirname + '/out/' + query + '/data/' + files[i], "utf8"));
    if (fj.timeofgame && fj.location) outs.push(fj)
  }
  console.log("SENDING " + outs.length + " RECORDS.");
  res.render('index',
  { title : 'Home', defTogJSON:outs }
  )
  //return({images:outs})
}


