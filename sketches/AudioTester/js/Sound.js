// this is the Sound object
//
function Sound(fileLocation_, name_) {
	this.fileLocation = fileLocation_; // where it is on the computer
	this.name = name_; // name of the thing
	this.duration = -1; // length, in seconds, of the file
	this.volume = 0;
	this.audioElement;// the audioElement sound .  see http://www.w3schools.com/tags/ref_av_dom.asp

	this.volumeInc = 0; // amt to incrase or decrease the volume
	this.volumeInterval = 10; // ms interval for fading
	
	// intervals
	this.decreaseVolumeInterval = null;
	this.increaseVolumeInterval = null;


	// setup the thing by loading the file
	this.setupSound = function() {
		console.log("setting up sound: " + this.name + " for location: " + this.fileLocation);
		this.audioElement = new Audio(this.fileLocation);
		this.audioElement.addEventListener('canplaythrough', this.sayDidLoad(this.name), false);
		this.audioElement.load();
		this.audioElement.volume = this.volume;
		//console.log(this.audioElement.duration);
		//this.audioElement.play();


	} // end setupSound

	//
	this.sayDidLoad = function(name) {
		console.log("loaded sound file: " + this.name);
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
				if (this.duration == -1) 		{
					this.getDuration();
				}
				this.audioElement.currentTime = secondsIn;
				this.audioElement.play();
				if (this.volume < 1)  this.fadeIn();

				console.log("playing element");
			} else {
				console.log("already playing");
			}			
		} else {
			console.log("null sound file");
		}
	} // end setSRC

	//
	this.fadeIn = function(fadeTime) {
		if (fadeTime == undefined) fadeTime = 5;
		if (!this.audioElement.paused) {
			this.volumeInc = 1 / (fadeTime * 1000 / this.volumeInterval);
			// clear any interval to increase the volume
			if (this.decreaseVolumeInterval != null) {
				this.decreaseVolumeInterval.clearInterval();
				this.decreaseVolumeInterval = null;
			}
			this.increaseVolumeInterval = setInterval(this.increaseVolume.bind(this), 10);
			
		} else {
			console.log("cannot fade in, audioElement not playing");
		}
	} // end fadeIn
	//
	this.increaseVolume = function(audioElementIn) {
		this.volume += this.volumeInc;
		if (this.volume >= 1) this.volume = 1;
		this.audioElement.volume = this.volume;

		if (this.volume == 1) {
			clearInterval(this.increaseVolumeInterval);
			this.increaseVolumeInterval = null;
			console.log("volume at " + this.volume + " will now clear interval");
		}
	} // end decreaseVolume	

	
	//
	this.fadeOut = function(fadeTime)  {
		if (fadeTime == undefined) fadeTime = 5;
		if (!this.audioElement.paused) {
			this.volumeInc = 1 / (fadeTime * 1000 / this.volumeInterval);
			//console.log("this.volumeInterval: " + this.volumeInterval);
			//console.log("fadeTime: " + fadeTime);
			//console.log("in fadeOut for audioElement/Sound: " + this.name + " over " + fadeTime + " seconds.  equates to step of: " + this.volumeInc);
			//console.log(" this.volume: " + this.volume);
			// clear any interval to increase the volume
			if (this.increaseVolumeInterval != null) {
				clearInterval(this.increaseVolumeInterval);
				this.increaseVolumeInterval = null;
			}
			this.decreaseVolumeInterval = setInterval(this.decreaseVolume.bind(this), 10);
			
		} else {
			console.log("cannot fade out, audioElement already paused");
		}
	} // end fadeOut
	//
	this.decreaseVolume = function(audioElementIn) {
		//console.log("in decrease volume for " + this.name);
		this.volume -= this.volumeInc;
		if (this.volume <= 0) this.volume = 0;
		//console.log("volume as " + this.volume);
		this.audioElement.volume = this.volume;

		if (this.volume == 0) {
			this.pause();
			clearInterval(this.decreaseVolumeInterval);
			this.decreaseVolumeInterval = null;
			console.log("volume at " + this.volume + " will now pause");
		}
	} // end decreaseVolume





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

	//
	this.getDuration = function() {
		if (this.duration == -1) {
			this.duration = this.audioElement.duration;
			console.log("setting duration to: " + this.duration);		
		}
		return this.duration;
	} // end getDuration

	//
	this.getVolume = function() {
		return this.volume;
	} // end getVolume
	this.getVolumeInc = function() {
		return this.volumeInc;
	} // end getVolumeInc

	//
	this.getIsPlaying = function() {
		return !this.audioElement.paused;
	} // end getIsPlaying

} // end class Sound





