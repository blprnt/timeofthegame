// this is the Sound object
//
function Sound(fileLocation_, name_) {
	this.fileLocation = fileLocation_; // where it is on the computer
	this.name = name_; // name of the thing
	this.duration = 0; // length, in seconds, of the file
	this.volume = 0;
	this.audioElement;// the audioElement sound .  see http://www.w3schools.com/tags/ref_av_dom.asp
	



	// setup the thing by loading the file
	this.setupSound = function() {
		console.log("setting up sound: " + this.name + " for location: " + this.fileLocation);
		this.audioElement = new Audio(this.fileLocation);
		this.audioElement.addEventListener('canplaythrough', this.sayDidLoad(this.name), false);
		this.audioElement.load();
		//console.log(this.audioElement.duration);
		//this.audioElement.play();


	} // end setupSound

	//
	this.sayDidLoad = function(name) {
		console.log("loaded sound file: " + this.name);
		console.log("is audioElement null? " + (this.audioElement == null ? "yes" : "no"));
		this.duration = this.audioElement.duration;
		console.log("duration: " + this.duration);		
	} // end sayDidLoad

	//
	this.sayDidPlay = function(name) {
		console.log("starting to play sound file: " + this.name);
	} // end sayDidLoad

	//
	this.startPlaying = function(secondsIn) {
		console.log("in startplaying");
		if (this.audioElement != null) {

			console.log('trying to go to and play: ' + secondsIn);
			if (this.audioElement.paused) {

				this.audioElement.currentTime = secondsIn;
				this.audioElement.play();

				console.log("playing element");
				console.log("maybe now duration works? " + this.audioElement.duration);
			} else {
				console.log("already playing");
			}			
		} else {
			console.log("null sound file");
		}
	} // end setSRC

	//
	this.fadeOut = function(fadeTime)  {
		console.log("in fadeOut for audioElement/Sound: " + name);
		// use jquery to set volume
		// when done pause the sound
	} // end fadeOut

	//
	this.pause = function() {
		if (!this.audioElement.paused) {
			this.audioElement.pause();
			console.log("pausing element");
			console.log("currentTime: " + this.audioElement.currentTime);
			console.log("loop?: " + this.audioElement.loop);
			console.log("current volume: " + this.audioElement.volume);
		} else {
			console.log("already paused");
		}
	} // end pause


/*
	$('.play').click(function() {
		if (audioElement.paused) {
			audioElement.play();
			console.log("playing element");
		} else {
			console.log("already playing");
		}
	});

	$('.pause').click(function() {
		if (!audioElement.paused) {
			audioElement.pause();
			console.log("pausing element");
			console.log("currentTime: " + audioElement.currentTime);
			console.log("loop?: " + audioElement.loop);
			console.log("current volume: " + audioElement.volume);
		} else {
			console.log("already paused");
		}
	});
*/
	//
	this.getLocation= function() {
		return this.fileLocation;
	} // end getLocation

	//
	this.getName = function() {
		return this.name;
	} // end getName


} // end class Sound