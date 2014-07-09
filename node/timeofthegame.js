/*

Time of the Game (node.js)
The Office For Creative Research
July, 2014

https://github.com/blprnt/timeofthegame

*/

var Twit = require('twit')
var fs = require('fs')

var T = new Twit({
    consumer_key: '4EP6uesxxc1g4ALu93Oh6R0UU',
    consumer_secret: 'LRBAh8PRJN5SAdFDkrM7m5OoPh1zxc5B3f9pbJ6e2sGDrnlD8V',
    access_token: '17013577-lq2s2tc0IVPUAftYZFO6rOm9uWeHxqV8KXCXZuZAw',
    access_token_secret: 'rJ8mPctIdYfgaoJjOvpPe7xbpyqJVOynQeJe5zK6Ct4kc'
})

//
//  search twitter for all tweets containing the word 'banana' since Nov. 11, 2011
//
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


