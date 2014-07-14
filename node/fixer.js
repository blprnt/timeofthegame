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

var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('6de45b31bb7f7f4a1e45926549d1ce288a8cff5b');
//27da825640fc907d1957ec6ae95905ed9dae04ae
//9993f67ac97ab171a7d28ce4df491636f100b972

var query = "thetimeofthegame";

var T = new Twit({
    consumer_key: '4EP6uesxxc1g4ALu93Oh6R0UU',
    consumer_secret: 'LRBAh8PRJN5SAdFDkrM7m5OoPh1zxc5B3f9pbJ6e2sGDrnlD8V',
    access_token: '17013577-lq2s2tc0IVPUAftYZFO6rOm9uWeHxqV8KXCXZuZAw',
    access_token_secret: 'rJ8mPctIdYfgaoJjOvpPe7xbpyqJVOynQeJe5zK6Ct4kc'
})

var path = require('path'),
    appDir = path.dirname(require.main.filename);

 var files = fs.readdirSync(appDir + '/public/out/' + query + '/data');

 var i =0 ;

 setInterval(processFile,1000);



 function processFile() {
//Get all tweets with the dumbass fake tweet.
try {
    var fj = JSON.parse(fs.readFileSync(appDir + '/public/out/' + query + '/data/' + files[i], "utf8"));
    if (fj.location == "San Francisco" || fj.timeofgame == 54) {

    		 var fpath = files[i];
    		 var nfj = fj;

        	  //Get location
              alchemy.entities(fj.status, {}, function(err, response) {
              if (err) throw err;
              console.log("DOING ALCHEMY");
              // See http://www.alchemyapi.com/api/entity/htmlc.html for format of returned object
              var entities = response.entities;
              var hasCity = false;
              var hasCountry = false;
              var country;
              var tweetLoc;
              

              for (var i = 0; i < entities.length; i++) {
                console.log(entities[i].type);
                  if (entities[i].type == 'City') {
                    tweetLoc = entities[i].text;
                    hasCity = true;
                    //console.log("FOUND CITY")

                  } else if (entities[i].type == 'Country') {
                    country = entities[i].text;
                    hasCountry = true;
                    //console.log("FOUND COUNTRY")
                  }
                  if (hasCountry && !hasCity) tweetLoc = country;
               }

              // Do something with data
              console.log("LOCATION:" + tweetLoc)
              nfj.location = tweetLoc;  

              var myRe = new RegExp("([0-9]{1,3})[mM^th minute]+", "g");
          	  var myArray = myRe.exec(fj.status);

          	  if (myArray) {
          	  	var tog = myArray[1];
          	  	console.log("TIME OF GAME:" + tog)
            	nfj.timeofgame = tog;
          	  }  

              saveDir = appDir+ '/public/out/' + query;

		        var outputFilename = saveDir + '/fixed/' + nfj.id + ".json";
		        fs.writeFile(outputFilename, JSON.stringify(nfj, null, 4), function(err) {
		          if(err) {
		            console.log(err);
		          } else {
		            console.log("******************FIXED JSON saved to " + outputFilename);
		          }
		        });           

            });

      
        

    }
  } catch(err) {
    console.log(err)
  }
  i++;
}