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
			loop:true,
			onload:sayDidLoad("american"),
		});
	} // end setupSound


	//
	function sayDidLoad(name) {
		console.log("loaded sound file: " + name);
	} // end sayDidLoad

	//
	this.startPlaying = function(urlIn) {
		sound.play();
	} // end setSRC

	//
	this.getSRC = function() {
		return url;
	} // end getSRC

} // end class Sound