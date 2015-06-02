// convert files to ogg from here:
// http://audio.online-convert.com/convert-to-ogg

var audioElement = null;

$().ready(function() {
	audioElement = document.createElement('audio');
	audioElement.setAttribute('src', 'audio/idaho.ogg');
	//audioElement.setAttribute('autoplay', 'autoplay');
	//daudioElement.load();

	audioElement.addEventListener('canplaythrough', function() {
		audioElement.currentTime = 12;
		audioElement.play();
		console.log("did canplaythrough");
	});	




/*	
	audioElement.addEventListener("load", function() {
		audioElement.play();
	}, true);
*/

	$('.play').click(function() {
		audioElement.play();
		console.log("playing element");
	});

	$('.pause').click(function() {
		audioElement.pause();
		console.log("pausing element");
	});




        // assign keyPress function/debug direct interactions
        $(window).keydown(function(e) {
        	var isShift = !!window.event.shiftKey;
        	var shiftMultiplier = 10;
        	var thisString = String.fromCharCode(e.keyCode).toLowerCase();
		//console.log("did keyPress for key: " + thisString);
		if (thisString === 'd') {
			console.log("current volume level: " + audioElement.volume);
			console.log("current time: " + audioElement.currentTime);
		} else if (thisString === 'z') {
			audioElement.pause();
			var totalDuration = audioElement.duration;
			console.log("total duration as: " + totalDuration);
			var newTime = Math.floor(Math.random() * totalDuration);
			console.log(" new time as: " + newTime);
			audioElement.src = audioElement.src; // hack to get it to reload the source??
			audioElement.currentTime = newTime;
			audioElement.play();
			console.log("current volume level: " + audioElement.volume);
			console.log("current time: " + audioElement.currentTime);
		}
		// arrows
		else if (e.keyCode === 37) {
			// left -- slimmer
		} else if (e.keyCode === 38) {
			// up -- move up
			audioElement.volume += .1;
		} else if (e.keyCode === 39) {
			// right -- wider
		} else if (e.keyCode == 40) {
			// down -- move down
			audioElement.volume -= .1;
		} else if (e.keyCode == 189) {
			// the - key
		} else if (e.keyCode == 187) {
			// the = key
		}

	});


console.log("READY");
});
