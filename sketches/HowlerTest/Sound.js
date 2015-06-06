// this is the Sound object
//
function Sound(fileLocation, name, length) {
	this.fileLocation = fileLocation; // where it is on the computer
	this.name = name; // name of the thing
	this.length = length; // length, in seconds, of the file
	
	this.volume = 0;
	this.pos = 0; // playbacktime in seconds
	this.isPlaying = false;

	this.sound = null; // the Howler sound object

	// setup the thing by loading the file
	this.setupSound = function() {
		console.log("setting up sound: " + this.name);
		this.sound = new Howl({
			urls: [this.fileLocation],
			preload:true,
			//loop:true,
			//onload:sayDidLoad(this.name),
			//onplay:sayDidPlay(this.name),
			//buffer:true,
			//autoplay: true,
			volume:.6,
		}).play();
		//this.sound.on('load', sayDidLoad(this.name));

	} // end setupSound


	//
	function sayDidLoad(name) {
		console.log("loaded sound file: " + name);
	} // end sayDidLoad

	//
	function sayDidPlay(name) {
		console.log("starting to play sound file: " + name);
	} // end sayDidLoad

	//
	this.startPlaying = function(secondsIn) {
		if (this.sound != null) {
			this.sound.pause();
			this.sound.play();
			this.sound.pos(secondsIn);
			console.log('trying to go to: ' + secondsIn);
		} else {
			console.log("null sound file");
		}
	} // end setSRC

	//
	this.getSRC = function() {
		return url;
	} // end getSRC

} // end class Sound