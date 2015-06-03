// this is the Sound object
//
function Sound(fileLocation, name, length) {
	this.fileLocation = fileLocation; // where it is on the computer
	this.name = name; // name of the thing
	this.length = length; // length, in seconds, of the file
	

	this.alphaMax = alphaMax;
	this.delay = delay;
	this.displayTimeInSeconds = displayTimeInSeconds;
	this.conception = conception;
	var actuallyLoadedImage = false; // set to true in setNewConception
	imageCorners = imageCorners;


	var alpha = 0;
	var okToDie = false; // for killing off things
	var okToDieTime ; // when it was marked to die

	var invMat; // used for image transformation stuff

	var triggered = false; // set to true when the alpha is > 0 for the first time
	var firedFaderLabelAlready = false; // triggered to true after 'triggered' is true and the global render asks it to

	//
	this.setSRC = function(urlIn) {
		image.src = urlIn; // where the image file is located
		url = urlIn;
		image.addEventListener("load", function() {
			didLoadImage(url)
		}, false);
	} // end setSRC

	//
	this.getSRC = function() {
		return url;
	} // end getSRC

} // end class Sound