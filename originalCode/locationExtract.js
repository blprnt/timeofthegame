var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('6de45b31bb7f7f4a1e45926549d1ce288a8cff5b');

console.log("TEST");

alchemy.entities('@siddhmi @tejucole 54th minute, downtown San Francisco, #thetimeofthegame pic.twitter.com/A68DyT85xQ', {}, function(err, response) {
  if (err) throw err;

  // See http://www.alchemyapi.com/api/entity/htmlc.html for format of returned object
  var entities = response.entities;
  console.log(entities)

  // Do something with data
});