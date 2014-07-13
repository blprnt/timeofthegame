/*

Time of the Game (node.js)
The Office For Creative Research
July, 2014

https://github.com/blprnt/timeofthegame

*/

var Twit = require('twit')
var fs = require('fs')
var mkdirp = require('mkdirp')
var request = require('request')

var T = new Twit({
    consumer_key: '4EP6uesxxc1g4ALu93Oh6R0UU',
    consumer_secret: 'LRBAh8PRJN5SAdFDkrM7m5OoPh1zxc5B3f9pbJ6e2sGDrnlD8V',
    access_token: '17013577-lq2s2tc0IVPUAftYZFO6rOm9uWeHxqV8KXCXZuZAw',
    access_token_secret: 'rJ8mPctIdYfgaoJjOvpPe7xbpyqJVOynQeJe5zK6Ct4kc'
})

//
//  STREAM SCRAPER
//
//
var searchQuery = 'selfie'
var saveDir = __dirname + '/out/' + searchQuery;
var imageUrlMap = [];

var init = function() {

  console.log("Making Directory: " + saveDir)

  mkdirp(saveDir + "/images", function(err) { 

      // path was created unless there was error;
      if (err) {
        console.log("ERROR" + err)
      }

      mkdirp(saveDir + "/data", function(err) {});
      startScrape();

  });
}

var startScrape = function() {
  console.log("Starting scraper.");
  var stream = T.stream('statuses/filter', { track: searchQuery })

  stream.on('tweet', function (status) {
    //DOES IT HAVE AN IMAGE?
    if (status.entities.media != undefined) {
        var media = status.entities.media;
        var url = media[0].media_url;
        //We don't already have it, download it
        if (imageUrlMap[url] == undefined) {
          console.log("NEW IMAGE:" + url);
          download(url, saveDir + "/images/" + status.id + '.jpg', function(){
          
          var testTweet = "29m Vancouver #timeofthegame";
          
          });
          //Save the JSON
          var outputFilename = saveDir + '/data/' + status.id + ".json";
          fs.writeFile(outputFilename, JSON.stringify(status, null, 4), function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log("JSON saved to " + outputFilename);
            }
          }); 
          imageUrlMap[url] = true;
        }
      }
  })
}

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

init();


//
//  OLD SCRAPER CODE
//
/*
var outputFilename = __dirname + '/out/tog.json';

T.get('search/tweets', { q: 'timeofthegame', count: 100 }, function(err, data, response) {
  console.log(data.statuses.length)
  fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
  }); 
})
*/


