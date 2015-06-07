// convert files to ogg from here:
// http://audio.online-convert.com/convert-to-ogg
// see http://www.w3schools.com/tags/ref_av_dom.asp

// NOTE TO SELF: USE NODE HTTPSERVER, not PYTHON because media stuff doesnt play will with it.
// http-server -p 8000


//var audioElement = null;
var mousePos = {x:-1, y:-1};
var pageDims = {w:100, h:100};

var sounds = [];

var options = [];
var currentOption = "lucky";
var currentOptionIndex = 1;

var soundLoaded = function(name) {
	console.log("DID LOAD THE AUDIO " + name);
} // end soundLoaded

$().ready(function() {

	$('.play').html("PLAY<br>" + Math.random().toPrecision(2));

	$('.option').html("currentOption: " + currentOption);

	var newSound = new Sound("audio/american.mp3", "american");
	newSound.setupSound();
	sounds[newSound.getName()] = newSound;
	options.push(newSound.getName());

	newSound = new Sound("audio/lucky.mp3", "lucky");
	newSound.setupSound();
	sounds[newSound.getName()] = newSound;
	options.push(newSound.getName());

	newSound = new Sound("audio/california.mp3", "california");
	newSound.setupSound();
	sounds[newSound.getName()] = newSound;
	options.push(newSound.getName());

	newSound = new Sound("audio/idaho.mp3", "idaho");
	newSound.setupSound();
	sounds[newSound.getName()] = newSound;
	options.push(newSound.getName());

	newSound = new Sound("audio/hawaii.mp3", "hawaii");
	newSound.setupSound();
	sounds[newSound.getName()] = newSound;
	options.push(newSound.getName());	


	newSound = new Sound("/../../NFM/audio/BBCMerged.mp3", "bbc");
	newSound.setupSound();
	sounds[newSound.getName()] = newSound;
	options.push(newSound.getName());	

	


	pageDims.w = $(document).width();
	pageDims.h = $(document).height();



	$('.play').click(function() {
		sounds[currentOption].startPlaying(130);
		// fade out all existing sounds??
		for (var i = 0; i < options.length; i++) {
			//console.log("____checking name: " + options[i]);
			if (options[i] != currentOption) {
				if (sounds[options[i]].getIsPlaying()) {
					sounds[options[i]].fadeOut();
					console.log("fading out sound: " + sounds[options[i]].getName());
				}
			}
		}
	});

	$('.pause').click(function() {
		sounds[currentOption].pause();
	});

	$('.fade').click(function() {
		sounds[currentOption].fadeOut();
	});


        // assign keyPress function/debug direct interactions
        $(window).keydown(function(e) {
        	var isShift = !!window.event.shiftKey;
        	var shiftMultiplier = 10;
        	var thisString = String.fromCharCode(e.keyCode).toLowerCase();
		//console.log("did keyPress for key: " + thisString);
		if (thisString === 'd') {
			//console.log("current volume level: " + audioElement.volume);
			//console.log("current time: " + audioElement.currentTime);
		} else if (thisString === 'z') {
			/*
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
			*/
		}
		// arrows
		else if (e.keyCode === 37) {
			// left -- slimmer
			currentOptionIndex++;
			if (currentOptionIndex >= options.length) currentOptionIndex = 0;
			currentOption = options[currentOptionIndex];
			$('.option').html("currentOption: " + currentOption);

		} else if (e.keyCode === 38) {
			// up -- move up
			audioElement.volume += .1;
		} else if (e.keyCode === 39) {
			// right -- wider
			currentOptionIndex--;
			if (currentOptionIndex < 0) currentOptionIndex =  options.length - 1;
			currentOption = options[currentOptionIndex];
			$('.option').html("currentOption: " + currentOption);
		} else if (e.keyCode == 40) {
			// down -- move down
			audioElement.volume -= .1;
		} else if (e.keyCode == 189) {
			// the - key
		} else if (e.keyCode == 187) {
			// the = key
		}
		// numbers
		else if (thisString === '1') {
			console.log("pressed: " + thisString);
		} else if (thisString === '2') {
			console.log("pressed: " + thisString);
		} else if (thisString === '3') {
			console.log("pressed: " + thisString);
		} else if (thisString === '4') {
			console.log("pressed: " + thisString);
		} else if (thisString === '5') {
			console.log("pressed: " + thisString);
		} else if (thisString === '6') {
			console.log("pressed: " + thisString);
		}

	}); // end keydown for document

$(document).mousemove(function(event) {
	mousePos.x = event.pageX;
	mousePos.y = event.pageY;
});

$(document).click(function() {
	// set the volume...
	/*
	console.log("mouse as: " + mousePos.x + ", " + mousePos.y);
	console.log("pageDims as: " + pageDims.w + ", " + pageDims.h);
	var newVolume = mousePos.y / pageDims.h;
	console.log("new volume as: " + newVolume);
	audioElement.volume = newVolume;
	*/
    	}); // end click for document

}); // end ready function
