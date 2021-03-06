// TO DO: pick a font to use
// stylize the thing 
//  spacing of terms
//  look of the clock


// notes:
// cannot use canvas and jquery:
// http://stackoverflow.com/questions/19179025/how-can-i-fade-html5-canvas-ctx-objects-in-and-out-using-jquery
// the original main file which is used to get image coordinates can be found here: http://timeofthegame.o-c-r.org/out/thetimeofthegame/data/main.json
//  this is downloaded and saved to the


// CONTROL VARS
// CONTROL VARS
// CONTROL VARS
// how fast is a game minute:
// determines the overall speed of the animation
// 60000 would be an actual minute

var gameMinuteMS = 0; // 1500; // set in timingPreferences.json
// this is the tracker of the actual game time.  Number here is where it will start
var gameMinuteTracker = 0; //50; // set in timingPreferences.json
var lastGameMinuteShown = gameMinuteTracker ; // used when undoing the suppress
//
var maximumImagesPerMinute = 0; // 20; // this controls how many images are added in the array per minute  // set in timingPreferences.json
var maximumPhotosToHaveTotal = 0; // 8; // any photos over this amt will be killed // set in timingPreferences.json

//
//
var gameTimerInterval = null;
var globalRenderInterval = null;

//
var secondTimer = null; // the actual intervaled timer object
var secondTracker = 0; // the second time



// DISPLAY VARS
// DISPLAY VARS
// DISPLAY VARS
var w; // basic width of actual display screen
var h; // basic height of actual display screen

// keep the ideal target width and height
var target_width = 160;
var target_height = 90;
// the usable width and height - defined when read in via the JSON in .ready()
var usable_width = target_width;
var usable_height = target_height;
// vertical shift on the screen
var vertical_shift = 0;

var corners_out; // the corners for displaying the image

// variables for the panel appearance
// how big each panel is, pre-overlap
var panelWidth = 1920; // set in plamentPreferences.json
// overlap between panels
var panelOverlap = 288; // set in plamentPreferences.json

// how wide is the gradient.  this makes new gradientLeft and gradientRight divs
var gradientWidth = 288; // set in plamentPreferences.json

// placement vars
// clock positioning
var clockLeftPos = 90; // set in placementPrefrences.json
var clockTopPos = 30;

// listFader positioning. 
var listFaderRightPos = 70; // set in placementPrefrences.json
var listFaderTopPos = 30; 
var listFader = null; // the actual fader object






// time for the images
var imageWarmupTimeInSeconds = 0;
var imageDisplayTimeInSeconds = 0; // how long the image is displayed at max alpha
// note that this is adjusted in the generateImageArray function
// for the regular images this will be used
// for the city images they will be displayed for the remainder of the city time
var imageFadeOutTimeInSeconds = 0;

// time to animate labels and all that
var animationTime = 0;


// debug stuff
var debug = false;

// 
var gridOn = false;  // will draw the grid on top of everything before it is split.  for alignment
var splittingOn = false; // will toggle whether or not the image is split up

var masksOn = false; // whether or not to start with the masks.  then later whether or not to  toggle them



// DATA VARS
// DATA VARS
// DATA VARS
// raw data stuff
var allData; // the raw data file.  holds everything initially read in
var data; // a temporary data file with the filtered data


// all of the photo objects
var currentPhotos = [];

// min and max range saved out here so that when a city is used these params can be used too
var minRange;
var maxRange;



// specific rendering vs global rendering
var suppressGameRendering = false;

// valid city options to jump to
var validCityOptions = []; // the cities that have at least n photos
var validCityOptionsMin = 1; // a city needs at least this many.  set in timingPreferences
var lastFocusCities = []; // keep track of the last focus city so it doesnt repeat
var lastFocusCityCount = 2; // how long the lastFocusCity array will be

// modes - city vs regular
var inCityMode = false;
var cityThresholdCount = 0; // when the count for a minute doesnt meet this then city mode is entered.  set in preferences


// SOUNDS
var useHTMLSounds = false; // whether or not to use html sounds.  if set to true will actually read in the mp3s and all that
var sounds = [];
var crossFadeTime = 4; // seconds.  set in timingPreferences.json
var languagePreferences = [];







//
$().ready(function() {
	// Returns height of browser viewport
	w = $(window).width();

	// Returns height of HTML document
	h = $(window).height();

	var canvas = document.createElement('canvas');
	canvas.id = "output";
	canvas.width = w;
	canvas.height = h;

	$('.canvii').append(canvas);

	$('.cities').css({
		position : 'fixed',
		top : "20px",
		right : "0px",
		width : 200 + "px",
	})






	// set th
	// load thee imageDescription placement
	/*
	$('.imageDescription').css({
		top : imageDescriptionTopPos + "px",
		right : imageDescriptionRightPos + "px"
	})
*/





	// setup the SOUNDS
	if (useHTMLSounds) {
		var newSound = new Sound("audio/BBCMerged.mp3", "british");
		newSound.setupSound();
		sounds[newSound.getName()] = newSound;

		newSound = new Sound("audio/QuickDirtySofterSpanish.mp3", "spanish");
		newSound.setupSound();
		sounds[newSound.getName()] = newSound;
	}
	

	// load up the languagePreferences file
	console.log("LOAD OF THE LANGUAGEPREFERENCES FILE");
	$.getJSON('out/thetimeofthegame/languagePreferences.json', function(data) {// local copy
		console.log(data);
		var allLanguagePreferences = data.languagePreferences;
		for (var i = 0; i < allLanguagePreferences.length; i++) {
			var modifiedLoc =  getSimpleLocationName(allLanguagePreferences[i].location);
			languagePreferences[modifiedLoc] = allLanguagePreferences[i].languagePreference;
			console.log(modifiedLoc);
		}
	});
	console.log("loaded languagePreferences " );
	console.log(languagePreferences);





	// general placement file
	console.log("LOAD OF THE PLACEMENT FILE");
	$.getJSON('out/thetimeofthegame/placementPreferences.json', function(data) {// local copy
	//$.getJSON('http://timeofthegame.o-c-r.org/out/thetimeofthegame/data/placementPreferences.json', function(data) { // web copy
		console.log(data);
		usable_height = data.usable_height;
		if (usable_height == undefined)
			usable_height = target_height;
		usable_width = data.usable_width;
		if (usable_width == undefined)
			usable_width = target_width;
		vertical_shift = data.vertical_shift;
		if (vertical_shift == undefined)
			vertical_shift = 0;
		listFaderRightPos = data.listFaderRightPos;
		if (listFaderRightPos == undefined)
			listFaderRightPos = 100;
		listFaderTopPos = data.listFaderTopPos;
		if (listFaderTopPos == undefined)
			listFaderTopPos = 100;

		// clock positioning
		clockLeftPos = data.clockLeftPos;
		if (clockLeftPos == undefined)
			clockLeftPos = 90;
		clockTopPos = data.clockTopPos;
		if (clockTopPos == undefined)
			clockTopPos = 30;

		// set the clock placement
		$('.clock').css({
			top : clockTopPos + "px",
			left : clockLeftPos + "px",
		})		

		// variables for shifting
		panelWidth = data.panel_width;
		if (panelWidth == undefined) 
			panelWidth = 1920;
		panelOverlap = data.panel_overlap;
		if(panelOverlap == undefined) 
			panelOverlap = 288;
		// if the panelWidth > canvas.width.. then do something
		if (panelWidth * 3 - 2 * panelOverlap > canvas.width) {
			var oldPanelWidth = panelWidth;
			console.log("panel width calcs result greater than overall width.  reducing")
			panelWidth = Math.round((canvas.width + 2 * panelOverlap) / 3 - 1);
			console.log(" reducing the panel width from: " + oldPanelWidth + " to: " + panelWidth + " with an overlap of: " + panelOverlap);
		}
		gradientWidth = data.gradient_width;
		if (gradientWidth == undefined) gradientWidth = 288;


	})

	// preferences for timing and all that
	console.log("LOAD OF THE PREFERENCES FILES");
	$.getJSON('out/thetimeofthegame/timingPreferences.json', function(data) {// local copy
		console.log(data);
		gameMinuteMS = data.gameMinuteMS;
		if (gameMinuteMS == undefined)
			gameMinuteMS = 60000;
		gameMinuteTracker = data.gameMinuteTracker;
		if (gameMinuteTracker == undefined)
			gameMinuteTracker = 50;
		maximumImagesPerMinute = data.maximumImagesPerMinute;
		if (maximumImagesPerMinute == undefined)
			maximumImagesPerMinute = 20;
		maximumPhotosToHaveTotal = data.maximumPhotosToHaveTotal;
		if (maximumPhotosToHaveTotal == undefined)
			maximumPhotosToHaveTotal = 25;
		animationTime = data.animationTime;
		if (animationTime == undefined)
			animationTime = 900;
		imageWarmupTimeInSeconds = data.imageWarmupTimeInSeconds;
		if (imageWarmupTimeInSeconds == undefined)
			imageWarmupTimeInSeconds = .5;
		imageDisplayTimeInSeconds = data.imageDisplayTimeInSeconds;
		if (imageDisplayTimeInSeconds == undefined)
			imageDisplayTimeInSeconds = 5;
		imageFadeOutTimeInSeconds = data.imageFadeOutTimeInSeconds;
		if (animationTime == undefined)
			animationTime = 3;
		cityThresholdCount = data.cityThresholdCount;
		if (cityThresholdCount == undefined) 
			cityThresholdCount = 20;
		console.log("done loading preferences");

		// set min and max range
		minRange = gameMinuteTracker;
		maxRange = gameMinuteTracker;

		// sound stuff
		crossFadeTime  = data.crossFadeTime;
		if (crossFadeTime == undefined) crossFadeTime = 4;

		// how many images are required to make a city
		validCityOptionsMin = data.validCityOptionsMin;
		if (validCityOptionsMin == undefined) validCityOptionsMin = 10;
		
		// make the fader object now that the animation time is set
		listFader = new ListFader($('.ListFader'), animationTime, w, h, listFaderTopPos, listFaderRightPos);		
	})	


	// load the skip csv - a list of the files that should be skipped
	// load the skip files
	$.getJSON("out/thetimeofthegame/imageSkip.json", function(data) {
		console.log("adsfasdfasfd");
		console.log("adsfasdfasfd");
		console.log("adsfasdfasfd");
		console.log(data);
		var imagesToSkip = [];
		var skip = data.skip;
		for (var j = 0; j < skip.length; j++) {
			var thisId = skip[j].id;
			imagesToSkip[thisId] = 0;
		}


		// now load the main json
		// reminder: check if a key is in an associative array
		//if (soundName in sounds) {


		//LOAD JSON for the actual data
		console.log("LOAD JSON");
		$.getJSON('out/thetimeofthegame/main.json', function(data) {// local copy
		//$.getJSON('http://timeofthegame.o-c-r.org/out/thetimeofthegame/data/main.json', function(data) { // web copy
			console.log(data);
			allData = [];
			// cycle though the data, only add the ones that arent skippable
			// take out the skip files
			for (var i = 0; i < data.images.length; i++) {
				var thisImage = data.images[i];
				if (thisImage.id in imagesToSkip) {
					console.log("skipping image: " + thisImage.id);
				} else {
					allData.push(thisImage);
				}
			}
			//allData = data.images;
			
			console.log("finished loading all data.  size: " + allData.length);

			
			init(); // in imageDisplayFunctions.js

			// also make a temp count of all images per minute for reference
			var imagesPerMinute = [];
			for (var i = 0; i <= 130; i++) {
				imagesPerMinute[i] = 0;
			}

			// find the valid city options
			var cityTemps = [];
			for (var i = 0; i < allData.length; i++) {
				if (allData[i].location != undefined) {
					var thisCity = allData[i].location.toLowerCase().replace('.', '');
					if (cityTemps[thisCity] == null)  cityTemps[thisCity]  = 1;
					else cityTemps[thisCity] = cityTemps[thisCity] + 1;
				}
				// save time for logging to see how many images per minute there are
				if (allData[i].timeofgame < imagesPerMinute.length && allData[i].timeofgame >= 0) {
					imagesPerMinute[allData[i].timeofgame]++;
				} else {
					imagesPerMinute[imagesPerMinute.length - 1]++;
				}
			}
			//console.log(cityTemps);			
			for (var option in cityTemps) {
				//console.log(option + " -- " + cityTemps[option]);
				if (cityTemps[option] > validCityOptionsMin) {
					validCityOptions.push(option);
				}
			}
			console.log("valid city options:");
			console.log(validCityOptions);
			if (lastFocusCityCount > validCityOptions.length - 2)  lastFocusCityCount = validCityOptions.length - 1;
			//console.log("lastFocusCityCount set to: " + lastFocusCityCount);

			// print out the minute counts
			var minuteSum = 0;
			var cityMinutes = 0; // count of minutes that will go to city
			var nonCityMinutes = 0; // minutes that will play normally
			for (var i = 0; i <= 130; i++) {
				console.log("minute: " + i + " :: " + imagesPerMinute[i] + "     " + (imagesPerMinute[i] >= cityThresholdCount ? "iiiiii" : "city"));
				if (imagesPerMinute[i] >= cityThresholdCount) nonCityMinutes++;
				else cityMinutes++;
				minuteSum += imagesPerMinute[i];
			}
			console.log("imagesPerMinute sum: " + minuteSum);
			console.log("minutes that will go to city: " +  cityMinutes);
			console.log("minutes that will stay without city: " + nonCityMinutes);

			// start the timer now that the data is loaded
			// use them to start the overall timer
			// start up the game timer
			// note that gameMinuteMS determines the overall speed of the game minute
			gameTimer(false);
			gameTimerInterval = setInterval(function() {
				gameTimer(true)
			}, gameMinuteMS);		
		}) // end load of main file
	}); // end load of skip files


	//




	// start up the second timer
	/*
	var timerStuff = setInterval(function() {
		secondTimer()
	}, 1000);
*/

	// initialize clock text and positioning
	// set the clock text
	setClockDivText();




	// assign keyPress function/debug direct interactions
	$(window).keydown(function(e) {
		var isShift = !!window.event.shiftKey;
		var shiftMultiplier = 10;
		// shift will increase the edit by this much
		//console.log("keyCode is: " + e.keyCode + " shift? " + isShift);
		var thisString = String.fromCharCode(e.keyCode).toLowerCase();
		//console.log("did keyPress for key: " + thisString);
		if (thisString === 'd') {
			debug = !debug;
			console.log("turning debug to: " + debug)
		} 


		/*else if (thisString == 'u') {
			console.log("toggling clock to hide");
			toggleClock(false);
		} else if (thisString == 'i') {
			console.log("toggling clock to show");
			toggleClock(true);
		} else if (thisString == 'o') {
			console.log("toggling imageDescription to hide");
			toggleImageDescription(false);
		} else if (thisString == 'p') {
			console.log("toggling imageDescription to show");
			toggleImageDescription(true);
		}		
		*/

		// sound stuff
		else if (thisString === 'y') {
			// british
			playSound("british", getCurrentTimeInSeconds());
		} else if (thisString === 'u') {
			// spanish
			playSound("spanish", getCurrentTimeInSeconds());
		}else if (thisString === 'r') {
			pauseAllSounds();
		}
		
		// splitting, mask, and grid
		else if (thisString === 's') {
			toggleSplitting();
		} else if (thisString === 'm') {
			toggleGradientMasks();
		} else if (thisString === 'g') {
			toggleGrid();
		}

		else if (thisString === "o") {
			testRemoveAllListFaderItems();
		}

		// osc message stuff
		else if (thisString === 'p') {
			sendOSCMessage("hello world, this is an osc message");
		}

		// if debug is on then do other user commands
		if (debug) {
			if (thisString === 'z') {
				// save out the settings for the vertical placement and zoom level??
				//console.log("saving out the settings for placement");
				//var placementPreferencesJSON = makePlacementJSON();
				//console.log(placementPreferencesJSON);
				//localStorage.setItem('placementPreferences', placementPreferencesJSON);
				// for now simply display the value and assume that they wil be changed in the static .json file
			} else if (thisString === 'e') {
				//console.log("manual load for placement file")
				//var unpack = localStorage.getItem('placementPreferences');
				//console.log(unpack);
				//setCornersOut();
				// load up the json?
			} else if (thisString === 'k') {
				console.log("killing off current: " + currentPhotos.length + " photos");
				killOffCurrentPhotos();
			} else if (thisString === 'c') {
				console.log("going to do city render");
				toggleCityMode(true);
				killOffCurrentPhotos();				
				renderCity("London", gameMinuteMS, maximumImagesPerMinute);
			} else if(thisString === 'w'){
				stopEverything();
			}



			// play with the overlap and width 
			else if(e.keyCode === 190) {
				// period - bigger width
				modifyPanelWidth(isShift ? shiftMultiplier : 1, canvas.width);
			} else if (e.keyCode === 188) {
				// comma - smaller width
				modifyPanelWidth(-1 * (isShift ? shiftMultiplier : 1), canvas.width );
			} else if (e.keyCode === 221) {
				// right bracket - more overlap
				modifyPanelOverlap(1 * (isShift ? shiftMultiplier : 1) );
			} else if (e.keyCode === 219) {
				// left bracket - less overlap
				modifyPanelOverlap(-1 * (isShift ? shiftMultiplier : 1) );
			}


			// arrows
			else if (e.keyCode === 37) {
				// left -- slimmer
				//console.log("LEFT");
				imageModifyWidth(-1 * ( isShift ? shiftMultiplier : 1));
			} else if (e.keyCode === 38) {
				// up -- move up
				//console.log("UP");
				imageModifyVerticalShift(1 * ( isShift ? shiftMultiplier : 1));
			} else if (e.keyCode === 39) {
				// right -- wider
				//console.log("RIGHT");
				imageModifyWidth(1 * ( isShift ? shiftMultiplier : 1));
			} else if (e.keyCode == 40) {
				// down -- move down
				//console.log("DOWN");
				imageModifyVerticalShift(-1 * ( isShift ? shiftMultiplier : 1));
			} else if (e.keyCode == 189) {
				// the - key
				// zoom out
				imageModifyZoom(-.005 * ( isShift ? shiftMultiplier : 1));
			} else if (e.keyCode == 187) {
				// the = key
				// zoom in
				imageModifyZoom(.005 * ( isShift ? shiftMultiplier : 1));
			}
		}
	});


	// background wipe
	// note that gameMinuteMS determines the overall speed of the game minute
	// this is essentially the loop which re-renders everything
	// this is essentially the loop
	globalRenderInterval = setInterval(function() {
		globalRender()
	}, 20);
}) // end ready function
//
//


//
function init() {
	console.log("in init()");
	console.log($('#outputr'))
	console.log(w + ":" + h)
	output = document.getElementById('output');

	//setRandomData(30, 0, 120);
	//setRandomData(30, 60, 60);

	// the function that actually places where the screen will be
	setCornersOut();

	setRandomData(30);

	// setup the gradient divs
	if (masksOn) {
		masksOn = false;
		toggleGradientMasks();
	}
}// end init


// this will look for the gradient divs.  if they exist then remove them, else make them
function toggleGradientMasks() {
	if (!masksOn) {
		masksOn = true;
		var overallWidth = $(window).width();
		var overallHeight = $(window).height();
		console.log("adding gradients");

		// left
		var leftPanel1 = document.createElement('div');
		leftPanel1.className = 'gradientLeft';
		leftPanel1.style.width = gradientWidth + 'px';
		leftPanel1.style.height = overallHeight + 'px';
		leftPanel1.style.top = '0px';
		leftPanel1.style.right = (2 * overallWidth / 3) + 'px'; // because it's the right side, use 2x
		document.body.appendChild(leftPanel1);

		// right 
		var rightPanel1 = document.createElement('div');
		rightPanel1.className = 'gradientRight';
		rightPanel1.style.width = gradientWidth + 'px';
		rightPanel1.style.height = overallHeight + 'px';
		rightPanel1.style.top = '0px';
		rightPanel1.style.left = (2 * overallWidth / 3) + 'px'; // because it's the left side, use 2x
		document.body.appendChild(rightPanel1);

		// center gradients
		var centerLeft = document.createElement('div');
		centerLeft.className = 'gradientRight';
		centerLeft.style.width = gradientWidth + 'px';
		centerLeft.style.height = overallHeight + 'px';
		centerLeft.style.top = '0px';
		centerLeft.style.left = (overallWidth / 3) + 'px'; // because it's the left side, use 2x
		document.body.appendChild(centerLeft);

		var centerRight = document.createElement('div');
		centerRight.className = 'gradientLeft';
		centerRight.style.width = gradientWidth + 'px';
		centerRight.style.height = overallHeight + 'px';
		centerRight.style.top = '0px';
		centerRight.style.right = (overallWidth / 3) + 'px'; // because it's the left side, use 2x
		document.body.appendChild(centerRight);
	} else {
		console.log("removing gradients");
		$('.gradientLeft').remove();
		$('.gradientRight').remove();
		masksOn = false;
	}

} // end toggleGradientMasks


//
// the corners actually define where the screen will be drawn on the .. screen
function setCornersOut() {
	//corners_out = [[(output.width - usable_width) * 0.5, (output.height - usable_height) * 0.5 - 10], [(output.width - usable_width) * 0.5 + usable_width, (output.height - usable_height) * 0.5 - 10], [(output.width - usable_width) * 0.5 + usable_width, (output.height - usable_height) * 0.5 + usable_height - 10], [(output.width - usable_width) * 0.5, (output.height - usable_height) * 0.5 + usable_height - 10]];
	corners_out = [[(output.width - usable_width) * 0.5, (output.height - usable_height) * 0.5 - vertical_shift], [(output.width - usable_width) * 0.5 + usable_width, (output.height - usable_height) * 0.5 - vertical_shift], [(output.width - usable_width) * 0.5 + usable_width, (output.height - usable_height) * 0.5 + usable_height - vertical_shift], [(output.width - usable_width) * 0.5, (output.height - usable_height) * 0.5 + usable_height - vertical_shift]];
}// end function setCornersOut



// sound handler
function playSound(soundName, time) {
	console.log("sounds: " + sounds);
	console.log("sounds.length: " + Object.keys(sounds).length);

	// send an osc message
	if (typeof socket !== 'undefined') {
		console.log("in playSound sending OSC message");
		sendOSCMessage(soundName + "," + time + ",normal,undefined");
	} else {
		console.log("socket is undefined")
	}

	if (useHTMLSounds) {
		if (soundName in sounds) {
			console.log("rad, sounds has soundName: " + soundName + " -- will play it.  total sounds in array: " + sounds.length);
			for (var key in sounds) {
				var sound = sounds[key];
				console.log("name: " + sound.getName() + " is playing? " + sound.getIsPlaying());
				if (sound.getName() === soundName) sound.startPlaying(time, crossFadeTime);
				else sound.fadeOut(crossFadeTime);
			}
		} else {
			console.log("oops, sounds does not have soundName: " + soundName);
		}
	}
} // end playSound

function pauseAllSounds() {
	console.log("in pauseAllSounds");
	for (var key in sounds) {
		var sound = sounds[key];
		sound.fadeOut(2);

	}
} // end pauseAllSounds



// note only works in debug mode
function stopEverything() {
	console.log("in stopEverything");
	clearInterval(gameTimerInterval);
	clearInterval(globalRenderInterval);
	clearInterval(secondTimer);
} // end stopEverything

function testRemoveAllListFaderItems() {
	console.log("in testRemoveAllListFaderItems");
	$(".FaderListItem").remove();
}  // end testRemoveAllListFaderItems




//
// real timer
// this is the thing that will actually fire off the images
// maybe set a max rate?
//var lastActualSecond = -1;
//var lastActualMinute = -1;
function secondTimerInterval() {
	//var date = new Date();
	//var thisSecond = date.getSeconds();
	//var thisMinute = date.getMinutes();
	//if (thisSecond != lastActualSecond) {
		//console.log("Actual time MINUTE: " + thisMinute + " SECOND: " + thisSecond);
		//lastActualSecond = thisSecond;
		//lastActualMinute = thisMinute;
	//}
	secondTracker++;
	// set the html
	setClockDivText();
}// end secondTimerInterval

//

//
// game timer
  // from 0 to 120
  // NOTE: make this go to 123
// when a new minute triggers this will make the queue of images to play and their respective times
//  times will be actual times in real date time by second
function gameTimer(doIncrement) {
	if (doIncrement) gameMinuteTracker++; // set to false for very first run, otherwise true for interval
	// ****** set the maximum time here.  note that we will go through minute 123 since that's when the exiting stuff happens
	//if (gameMinuteTracker > 120)
	if (gameMinuteTracker > 123) {
		gameMinuteTracker = 0;
		oscCount = 0;
	}

	// reset the  second time
	// stop the second timer interval
	// restart the second timer interval
	if (secondTimer != null) {
		clearInterval(secondTimer);
	}
	secondTracker = 0;
	secondTimer = setInterval(function() {
		secondTimerInterval()
	}, 1000 * (gameMinuteMS / 60000));



	// do something here based on the minute
	// *** note here that we will manually modify the time if it is in extra time
	if (gameMinuteTracker <= 120) setTimeRange(gameMinuteTracker, gameMinuteTracker);
	else setTimeRange(0, 120); // this way if it is > 120 minutes we will grab all of the photos 

	// get the number of items that will be categorized intothis minute
	var thisMinuteCount = getThisMinuteCount();
	console.log("in gameTimer.  total regular options for thisMinuteCount is: " + thisMinuteCount);

	// CITY TRACK
	// determine whether or not to go into city mode
	// if so, then suppress the game rendering and pick a city to render
	// note:  see setSuppressGameRendering() to see how when the suppressGameRendering goes from true to false
	//  the system will automatically do the random data so it doesnt have to wait out the rest of the cycle
	if (thisMinuteCount < cityThresholdCount) {
		console.log("in gameTimer.  total options of " + thisMinuteCount + " is less than thresh of: " + cityThresholdCount);
		// find a new city to focus on
		var newFocusCity = "";
		var manualWhileBreak = 0;
		// then do the renderCity call on the new city
		if (lastFocusCities.length > lastFocusCityCount) {
			lastFocusCities.splice(0, 1);
		}

		while(true) {
			newFocusCity = validCityOptions[Math.floor(Math.random() * validCityOptions.length)];
			var isNew = true;
			for (var j = 0; j < lastFocusCities.length; j++) {
				if (lastFocusCities[j] == newFocusCity) {
					isNew = false;
					break;
				}
			}
			//var lastFocusCityCount = 2; // how long the lastFocusCity array will be	


			if (isNew) break;
			manualWhileBreak++;
			if (manualWhileBreak > 100) {
				console.log("MANUAL WHILE BREAK"); 
				break;
			}
		} // end while
		lastFocusCity = newFocusCity;
		lastFocusCities.push(newFocusCity);
		console.log(" lastFocusCities: " + lastFocusCities);
		console.log(" making a city " + newFocusCity);

		// if rendering a city:

		toggleCityMode(true);
		
		// kill off existing photos // uncalled for?
		killOffCurrentPhotos();

		// actually render 
		renderCity(newFocusCity, gameMinuteMS, 1 * maximumImagesPerMinute);
	} else {
		// REGULAR TRACK
		console.log("triggering gameTimer.  new game minute: " + gameMinuteTracker);
		setRandomData(gameMinuteMS, maximumImagesPerMinute);
		//lastGameMinuteShown = gameMinuteTracker; // keep track of this
		toggleCityMode(false);
	} 
	// set the clock
	setClockDivText();
}// end  gameTimer


//
function setTimeRange(minRangeIn, maxRangeIn) {
	console.log("in setTimeRange for min/max: " + minRangeIn + ", " + maxRangeIn);
	minRange = minRangeIn;
	maxRange = maxRangeIn;
}// end setTimeRange

// return the current millis()
function getCurrentTime() {
	var date = new Date();
	return date.getTime();
}// end getCurrentTime

//
// simple map function
function mathMap(num, low, high, newLow, newHigh) {
	if (newHigh - newLow == 0)
		return 0;
	return ((num - low) / (high - low)) * (newHigh - newLow) + newLow;
}// end mathMap
//
//

// wipe the background.. 
// this is essentially the draw loop
function globalRender() {
	var currentTime = getCurrentTime();
	var date = new Date();
	var thisSecond = date.getSeconds();
	var thisMinute = date.getMinutes();
	//console.log("globalRender.  minutes: " + thisMinute + " second: " + thisSecond + " currentTime: " + currentTime + " size of image array: " + currentImages.length);
	var context = output.getContext('2d');
	context.save();
	context.fillStyle = "black";
	//context.globalCompositeOperation = "difference";
	context.globalAlpha = 1;
	// clear the background
	context.clearRect(0, 0, output.width, output.height);



	// if the grid is on then draw a background so that  things don't overlap
	if (gridOn) {
		context.beginPath();
		context.rect(0, 0, output.width, output.height);
		context.fillStyle = $('body').css("background-color");
		context.fill();
		context.closePath();
	}



	// cycle through all images and render them with appropriate alpha
	// NOTE: the images are not necessarily in order because of the random timing
	// so to find which label to display find the one with a +alpha value and longest kill time
	//var maxAlpha = 0;
	//var imageDescriptionText = "";
	//var tempHighestImageConceptionValue = 0;

	// count all of the live photos.. those with an alpha value > 0
	var livePhotos = 0;
	for (var i = 0; i < currentPhotos.length; i++){
		if (currentPhotos[i].getAlpha() > 0) livePhotos++;
	}

	// update all of the images that are still valid
	// and also store the max alpha and description text and all that
	for (var i = currentPhotos.length - 1; i >= 0; i--) {
		currentPhotos[i].update(currentTime);
		// manage the listFader
		if (currentPhotos[i].shouldFireFaderLabel()) {
			var listItemLabel = currentPhotos[i].getFaderLabel();
			// ****** CHANGE THE LIST ITEM DURATION HERE ****** //
			// 1300 seems like a decent number?
			var listItemDuration = 1500 * currentPhotos[i].getDisplayTimeInSeconds();
			if (listItemLabel != " ") listFader.createNewListItem(listItemLabel, getCurrentTime(), listItemDuration);
		}

		// kill off any existing photos that are over the total limit:
		/*
		if (i < currentPhotos.length - maximumPhotosToHaveTotal && !currentPhotos[i].getOkToDie()) {
			currentPhotos[i].setToDie(getCurrentTime());
		}
		*/
		// update: only use the live current photos so that a big influx of photos won't kill off all of them at once
		if (i < livePhotos - maximumPhotosToHaveTotal && !currentPhotos[i].getOkToDie()) {
			currentPhotos[i].setToDie(getCurrentTime());
		}
		


		// delete dead ones
	//if ((currentPhotos[i].getOkToDie() && currentPhotos[i].getAlpha() <= 0) || (currentTime > currentPhotos[i].getConception()+ 1000 * (imageWarmupTimeInSeconds + currentPhotos[i].getDisplayTimeInSeconds() + imageFadeOutTimeInSeconds))) {
		if (currentPhotos[i].getOkToDie() && currentPhotos[i].getAlpha() <= 0) {
			currentPhotos[i].kill();
			currentPhotos.splice(i, 1);
		} else if(currentTime > currentPhotos[i].getConception()+ 1000 * (imageWarmupTimeInSeconds + currentPhotos[i].getDisplayTimeInSeconds() + imageFadeOutTimeInSeconds)) {
			currentPhotos[i].kill();
			currentPhotos.splice(i, 1);
		}
	}


	// do the actual rendering of the photos
	for (var i = 0; i < currentPhotos.length; i++) {
		currentPhotos[i].renderImage();
	}

	context.restore();




	// update the listFader
	//if (listFader != null) listFader.update(currentTime, context); // when using CANVAS
	if (listFader != null) listFader.update(currentTime); // when using DIVS
	// draw the listfader [now drawn to canvas]
	//if (listFader != null) listFader.display(context); // when using CANVAS
	// note: no display function when using divs.  all is taken care of in the update




	// now that everything's been drawn, do the grid drawing and splitting/masking if toggled on
	if (gridOn) {
		renderGrid(context);
	}


	// and finally do the splitting
	if (splittingOn) {
		performImageSplit(context, panelWidth, panelOverlap);
	}
	




	// DO THE DEBUG RENDERING of TEXT/PLACEMENT ETC.
	if (debug) {
		context.save();
		context.fillStyle = 'white';
		context.font = "24px Verdana";
		context.globalAlpha = 1;
		var x = 30;
		var y = 50;
		context.fillText("debug on", x, y);
		y += 30;
		context.fillText("usable_width: " + usable_width, x, y);
		y += 30;
		context.fillText("usable_height: " + usable_height, x, y);
		y += 30;
		context.fillText("vertical_shift: " + vertical_shift, x, y);
		y += 30;
		var currentRatio = (usable_width / usable_height);
		var targetRatio = (target_width / target_height);
		context.fillText("currentRatio: " + currentRatio, x, y);
		y += 30;
		context.fillText("baseRatio:    " + targetRatio, x, y);
		y += 30;
		context.fillText("panelWidth: " + panelWidth, x, y);
		y += 30;
		context.fillText("panelOverlap: " + panelOverlap, x, y);
		y += 30;
		context.fillText("Game Minute Tracker: " + gameMinuteTracker, x, y);
		y += 30;
		//context.fillText("currentImages.length: " + currentImages.length, x, y);
		context.fillText("currentPhotos.length: " + currentPhotos.length, x, y);
		y += 30;
		var count = 0;
		for (var i = 0; i < currentPhotos.length; i++) if (currentPhotos[i].getAlpha() > 0) count++;
			context.fillText("currentPhotos.length active: " + count, x, y);
		y += 30;
		context.fillText("listFader.listItems.length: " + listFader.getListItemsLength(), x, y);



		// do the city options

		context.restore();

}}// end function globalRender












