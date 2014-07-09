var fs = require('fs'),
	request = require('request')


var file = __dirname + '/out/tog.json';

fs.readFile(file, 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }
 
  data = JSON.parse(data);
 
  pullImages(data);
});

function pullImages(j) {
	for (var i = 0; i < j.statuses.length; i++) {
		var status = j.statuses[i];
		if (status.entities.media != undefined) {
			var media = status.entities.media;
			var url = media[0].media_url;
			console.log(url);
			download(url, "out/images/" + status.id + '.jpg', function(){
 				 console.log('done');
			});
		}
	}
}

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

