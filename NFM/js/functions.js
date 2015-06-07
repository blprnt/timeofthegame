// PLACEMENT FUNCTIONS for the image
// make the image wider/slimmer
function imageModifyWidth(amt) {
	usable_width += amt;
	console.log("in imageModifyWidth. setting usable_width to: " + usable_width + " -- usable_height as: " + usable_height + " ratio as: " + (usable_width / usable_height) + " original ratio: " + (target_width / target_height));
	setCornersOut();
}// end imageModifyWidth

// move the image up or down
function imageModifyVerticalShift(amt) {
	vertical_shift += amt;
	console.log("in imageModifyVerticalShift.  setting new vertical_shift to: " + vertical_shift);
	setCornersOut();
}// imageModifyVerticalShift


// change the panel width
function modifyPanelWidth(amt, canvasWidth) {
	panelWidth += amt;
	//if (panelWidth > (canvas.width + 2 * panelOverlap ) / 3 - 1) panelWidth = Math.round((canvas.width + 2 * panelOverlap) / 3 - 1);
	if (panelWidth > (canvasWidth + 2 * panelOverlap ) / 3 - 1) panelWidth = Math.round((canvasWidth+ 2 * panelOverlap) / 3 - 1);
	if (panelWidth < panelOverlap) panelWidth = panelOverlap;
} // end modifyPanelWidth

//change the overlap
function modifyPanelOverlap(amt) {
	panelOverlap += amt;
	if (panelOverlap > panelWidth - 1) panelOverlap = panelWidth - 1;
	if (panelOverlap < 0) panelOverlap = 0;
} // end modifyPanelOverlap



// toggle the splitting, grid, and overlay
function toggleSplitting() {
	splittingOn = !splittingOn;
	console.log("switting splittingOn to: " + splittingOn);
} // end toggleSplitting


//
// whether or not to draw the overlay grid
function toggleGrid() {
	gridOn = !gridOn;
	console.log("switting gridOn to: " + gridOn);
} // end toggleGrid







// zoom in and out of the image
function imageModifyZoom(amt) {
	// assume the current zoom is based on target_height
	var currentZoom = usable_height / target_height;
	var newZoom = currentZoom + amt;
	var tempHeight = usable_height / currentZoom;
	var tempWidth = usable_width / currentZoom;
	usable_width = tempWidth * newZoom;
	usable_height = tempHeight * newZoom;
	console.log("in imageModifyZoom. old zoom as: " + currentZoom + " and new at: " + newZoom + "  \n  setting usable_width to: " + usable_width + " -- usable_height as: " + usable_height + " ratio as: " + (usable_width / usable_height) + " original ratio: " + (target_width / target_height));
	setCornersOut();
}// end imageModifyZoom

// make the JSON of the placement preferences
function makePlacementJSON() {
	var preferences = new Object();
	preferences.usable_width = usable_width;
	preferences.usable_height = usable_height;
	preferences.vertical_shift = vertical_shift;
	var jsonified = JSON.stringify(preferences);
	return jsonified;
}// end makePlacementJSON





// OTHER FUNCTIONS 

//
// this will simply kill off all current photos
function killOffCurrentPhotos() {
	for (var i = 0; i < currentPhotos.length; i++) {
		currentPhotos[i].setToDie(getCurrentTime());
	}
} // end killOffCurrentPhotos;

//
function setSuppressGameRendering(value) {
	suppressGameRendering = value;
	console.log("Setting suppressGameRendering to: " + suppressGameRendering);
	// if the game time is not suppressed and the current game minute != last game minute then add the new images 'manually'
	// this way it doesnt have to wait a full cycle
	if (!suppressGameRendering && lastGameMinuteShown != gameMinuteTracker) {
		var thisMinuteCount = getThisMinuteCount();
		console.log("MANUAL GAME TIMER IMAGE MAKER");
		setRandomData(gameMinuteMS, maximumImagesPerMinute);
		lastGameMinuteShown = gameMinuteTracker; // keep track of this
	}
}  // end setSuppressGameRendering

//
   // get the number of items that will belong to this minute
   function getThisMinuteCount() {
   	// a bit repetitive, but that's ok
	// find out how many options are available for this minute
	data = [];
	for (var i = 0; i < allData.length; i++) {
		if (allData[i].timeofgame >= minRange && allData[i].timeofgame <= maxRange) {
			//console.log("candidate? location: " + allData[i].location + " time: " + allData[i].timeofgame);
			data.push(allData[i]);
		}
	}
	return data.length;
} // end getThisMinuteCount

// shuffle an array
// per http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex ;
  	// While there remain elements to shuffle...
  	while (0 !== currentIndex) {
   		 // Pick a remaining element...
   		 randomIndex = Math.floor(Math.random() * currentIndex);
   		 currentIndex -= 1;

   	 	// And swap it with the current element.
   	 	temporaryValue = array[currentIndex];
   	 	array[currentIndex] = array[randomIndex];
   	 	array[randomIndex] = temporaryValue;
   	 }
   	 return array;
} // end shuffle

// from http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
} // toTitleCase

//
// see http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
function measureText(divIn) {
	var lDiv = divIn;

	var lResult = {
		width: lDiv.clientWidth,
		height: lDiv.clientHeight
	};

	document.body.removeChild(lDiv);
	lDiv = null;

	return lResult;
} // end measureText




//
// actually draw clock text to the clock div
function getCurrentTimeInSeconds() {
	var currentTime = gameMinuteTracker * 60 + secondTracker;
	console.log("current time in seconds: " + currentTime);
	return currentTime;
}// end setClockDivText


