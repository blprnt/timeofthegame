



//
// toggles the display between city mode and ! city mode
// shifts the clock and city description back and forth
function toggleCityMode(showCity) {
	//if (showCity) {
		// always kill off the previous city's list
		listFader.killAllListItems();
	//}

	if (showCity && !inCityMode) {
		toggleClock(true);
		//toggleImageDescription(true);
		listFader.shiftFader(true);
		inCityMode = true;
		setSuppressGameRendering(true);
	} else if (!showCity && inCityMode) {
		inCityMode = false;
		toggleClock(false);
		//toggleImageDescription(false);
		listFader.shiftFader(false);
		setSuppressGameRendering(false);
	}
} // end toggleCityMode


//
// toggle the click
function toggleClock(show) {
	//console.log("clock stats: height: " + $('.clock').height() + " width: " + $('.clock').width() + " offset: " + $('.clock').offset().top + ", " + $('.clock').offset().left);
	if (show) {
		//console.log("showing clock now");
		var newTopPos = -10 - $('.clock').offset().top - $('.clock').height();
		$('.clock').animate({
			top : newTopPos + "px",
			opacity : 0
		}, animationTime);
	} else {
		var newTopPos = clockTopPos;
		//console.log("hiding clock now");
		$('.clock').animate({
			top : newTopPos + "px",
			opacity : 1
		}, animationTime);
	}
}


// toggle the listFaderDiv


/*
// toggle the image description div
function toggleImageDescription(show) {
	//console.log("imageDescription stats: height: " + $('.imageDescription').height() + " width: " + $('.imageDescription').width() + " offset: " + $('.imageDescription').offset().top + ", " + $('.imageDescription').offset().left);
	if (show) {
		//console.log("centering imageDescription");
		var newXPos = output.width / 2 - $('.imageDescription').width() / 2;
		$('.imageDescription').animate({
			right : newXPos + "px"
		}, animationTime);
	} else {
		var newTopPos = clockTopPos;
		//console.log("moving imageDescription back to base");
		$('.imageDescription').animate({
			right : imageDescriptionRightPos + "px"
		}, animationTime);
	}
}// end toggleImageDescription
*/

//
// actually draw clock text to the clock div
function setClockDivText() {
	$('.clock').empty();
	var textForClockTimer = gameMinuteTracker;
	$('.clock').html(textForClockTimer);
}// end setClockDivText


//
function setRandomData(allottedTime, maximumPhotoCount) {
	console.log("SET RANDOM.  min: " + minRange + " max:" + maxRange)
	candidates = [];
	data = [];
	for (var i = 0; i < allData.length; i++) {
		if (allData[i].timeofgame >= minRange && allData[i].timeofgame <= maxRange) {
			//console.log("candidate? location: " + allData[i].location + " time: " + allData[i].timeofgame);
			candidates.push(allData[i]);
		}
	}

	//var fraction = num / candidates.length;
	for (var i = 0; i < candidates.length; i++) {
		//if (Math.random() < fraction) // so it doesnt include all images.  that would be too many
		data.push(candidates[i]);
	}

	// add to global array
	var isCity = false;
	var newPhotos = generateImageArray(data, allottedTime, maximumPhotoCount, isCity);
	console.log('done with setRandomData.  pushed ' + data.length + ' things to the data array.  made ' + newPhotos.length + ' new photos with limit as: ' + maximumPhotoCount);

	// add new photos
	for (var i = 0; i < newPhotos.length; i++) {
		currentPhotos.push(newPhotos[i]);
	}
}// end setRandomData





// renders just the images for a city
// get city options
// generate the new image array based on the city and the total time to display this city
function renderCity(city, allottedTime, maximumPhotoCount) {
	console.log("in renderCity for city: " + city + " and allottedTime: " + allottedTime + " and maxPhotoCount: " + maximumPhotoCount);
	data = [];
	//data = [];
	for (var i = 0; i < allData.length; i++) {
		if (allData[i].location != undefined) {
			var loc = allData[i].location.toLowerCase().replace('.', '');
			// check city
			if (loc == city.toLowerCase().replace('.', '')) {
				// check time
				//if (allData[i].timeofgame >= minRange && allData[i].timeofgame <= maxRange) {
					data.push(allData[i]);
				//}
			}
		}
	}
	console.log("found " + data.length + " candidates for renderCity");

	// add to global array
	// multiply the max photo count to fit this grouping
	var isCity= true;
	var newPhotos = generateImageArray(data, allottedTime, maximumPhotoCount, isCity);
	console.log('done with renderCity.  pushed ' + data.length + ' things to the data array.  made ' + newPhotos.length + ' new photos');

	// add new photos
	for (var i = 0; i < newPhotos.length; i++) {
		currentPhotos.push(newPhotos[i]);
	}		
}// end renderCity



//
//
//
// take in the data and figure out the timing and all that other stuff, make new Photo objects
// add in the time frame from which to display this city
// isCity will make it so a random time is not used, but instead uses the game time
// shuffle is still in effect
function generateImageArray(candidates, allottedTime, maximumPhotoCount, isCity) {
	//console.log("in generateImageArray.  received " + candidates.length + " candidates for total time of: " + allottedTime);
	// somehow figure out which ones to keep and when the trigger points are
	var newPhotos = [];

	// shuffle the candidates so that the same ones don't always show up
	shuffle(candidates);

	//
	for (var index = 0; index < Math.min(candidates.length, maximumPhotoCount); index++) {
		var src = "out/thetimeofthegame" + candidates[index].localURL;
		var loc = candidates[index].location;
		// figure this out
		var thisMaxAlpha = .5;
		// figure this out
		// **** this delay should relate to the time alloted for this bunch
		var delay = Math.random() * allottedTime;
		var displayTime = imageDisplayTimeInSeconds;
		if (isCity) {
			// delay gets mapped by the image's time vs 120 minutes
			delay = mathMap(candidates[index].timeofgame, 0, 120, 0, allottedTime);
			
			displayTime = Math.max(imageDisplayTimeInSeconds, allottedTime - delay);
			// convert displayTime to seconds
			displayTime /= 1000;
			console.log("image name: " + candidates[index].localURL + " with minute: " + candidates[index].timeofgame + " maps to: " + delay + " displayTime: "+ displayTime);
		}
		var conception = getCurrentTime() ; 
		var corners = candidates[index].corners.split(",");
		var newPhoto = new Photo(loc, thisMaxAlpha, delay, displayTime, conception, corners);
		newPhotos.push(newPhoto);
		newPhoto.setSRC(src); // this will set the image and start up the callback function to reset coneption time
	}
	return newPhotos;
}// end generateImageArray





