



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
	var textForClockTimer = "";
	if (gameMinuteTracker < 100)  textForClockTimer += '&nbsp;';
	if (gameMinuteTracker < 10) textForClockTimer += '&nbsp;';
	textForClockTimer += gameMinuteTracker;
	textForClockTimer += ":"
	if (secondTracker < 10)  textForClockTimer += '0';
	textForClockTimer += secondTracker;
	// add in the second
	$('.clock').html(textForClockTimer);
	$('.clock').lettering();
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
			//console.log("image name: " + candidates[index].localURL + " with minute: " + candidates[index].timeofgame + " maps to: " + delay + " displayTime: "+ displayTime);
		}
		var conception = getCurrentTime() ; 
		var corners = candidates[index].corners.split(",");
		var photoType = "normal";
		if(isCity) photoType = "city";
		var newPhoto = new Photo(loc, thisMaxAlpha, delay, displayTime, conception, corners, photoType);
		newPhotos.push(newPhoto);
		newPhoto.setSRC(src); // this will set the image and start up the callback function to reset coneption time
	}
	return newPhotos;
}// end generateImageArray



//
//

function renderGrid(contextIn) {
	var canWidth = contextIn.canvas.width;
	var canHeight = contextIn.canvas.height;
	//console.log("width: " + canWidth + " height: " + canHeight);
	contextIn.save();
	// main center lines
	contextIn.beginPath();
	contextIn.moveTo(0, canHeight/2);
	contextIn.lineTo(canWidth, canHeight/2);
	contextIn.lineWidth = 4;
	contextIn.strokeStyle= '#ff0';
	contextIn.stroke();
	contextIn.closePath();
	contextIn.beginPath();
	contextIn.moveTo(canWidth/2, 0);
	contextIn.lineTo(canWidth/2, canHeight);
	contextIn.lineWidth = 4;
	contextIn.strokeStyle= '#ff0';
	contextIn.stroke();
	contextIn.closePath();
	var thinStroke = .5;
	var thickStroke = 1;
	// grid // vertical
	for (var x = 0; x < canWidth/2 ; x+= 25) {
		// right side
		contextIn.beginPath();
		contextIn.strokeStyle='#00f';
		contextIn.lineWidth = thinStroke;
		if (x % 100 == 0) {
			contextIn.strokeStyle='#0a0';
			contextIn.lineWidth = thickStroke;
		}
		contextIn.moveTo(canWidth/2 + x, 0);
		contextIn.lineTo(canWidth/2 + x, canHeight);
		contextIn.stroke();
		contextIn.closePath();

		// left side
		contextIn.beginPath();
		contextIn.strokeStyle='#00f';
		contextIn.lineWidth = thinStroke;
		if (x % 100 == 0) {
			contextIn.strokeStyle='#0a0';
			contextIn.lineWidth = thickStroke;
		}
		contextIn.moveTo(canWidth/2 - x, 0);
		contextIn.lineTo(canWidth/2 - x, canHeight);
		contextIn.stroke();
		contextIn.closePath();
	}
	// grid // horizontals
	for (var y = 0; y < canHeight/2; y+= 25) {
		// bottom side
		contextIn.beginPath();
		contextIn.strokeStyle='#00f';
		contextIn.lineWidth = thinStroke;
		if (y% 100 == 0) {
			contextIn.strokeStyle='#0a0';
			contextIn.lineWidth = thickStroke;
		}
		contextIn.moveTo(0, canHeight/2 + y);
		contextIn.lineTo(canWidth, canHeight/2 + y);
		contextIn.stroke();
		contextIn.closePath();

		// top side
		contextIn.beginPath();
		contextIn.strokeStyle='#00f';
		contextIn.lineWidth = thinStroke;
		if (y % 100 == 0) {
			contextIn.strokeStyle='#0a0';
			contextIn.lineWidth = thickStroke;
		}
		contextIn.moveTo(0, canHeight/2 - y);
		contextIn.lineTo(canWidth, canHeight/2 - y);
		contextIn.stroke();
		contextIn.closePath();
	}

	// diagonals
	for (var x = 0; x < canWidth/2+ canHeight/2; x += 100) {
		contextIn.beginPath();
		contextIn.strokeStyle='#a0a';
		contextIn.lineWidth = thinStroke;
		contextIn.moveTo(canWidth/2 + x + canHeight/2, 0);
		contextIn.lineTo(x + canWidth/2 - canHeight/2, canHeight);
		contextIn.stroke();
		contextIn.closePath();	
		if (x > 0) {
			contextIn.beginPath();
			contextIn.strokeStyle='#a0a';
			contextIn.lineWidth = thinStroke;
			contextIn.moveTo(canWidth/2 - x + canHeight/2, 0);
			contextIn.lineTo(-x + canWidth/2 - canHeight/2, canHeight);
			contextIn.stroke();
			contextIn.closePath();	
		}		
	}

	// text coords
	var offsetX = 10;
	var offsetY = 20;
	contextIn.fillStyle = 'white';
	contextIn.font = "10px Verdana";
	contextIn.globalAlpha = 1;
	for (var x = 0; x < canWidth/2; x += 100) {
		for (var y = 0; y < canHeight/2; y+=100) {
			contextIn.fillText(Math.round(x) +", " + Math.round(y), canWidth / 2 + x + offsetX, canHeight / 2 + y + offsetY);
			if (x != 0 || y != 0) {
				if (x != 0) contextIn.fillText("-" + Math.round(x) +", " + Math.round(y), canWidth / 2 - x + offsetX, canHeight / 2 + y + offsetY);
				if (y != 0) contextIn.fillText((x > 0 ? "-" : "") + Math.round(x) +", " + Math.round(y), canWidth / 2 - x + offsetX, canHeight / 2 - y + offsetY);
				if (x != 0 && y != 0) contextIn.fillText(Math.round(x) +", " + Math.round(y), canWidth / 2 + x + offsetX, canHeight / 2 - y + offsetY);
			}
		}
	}
	contextIn.restore();
} // end renderGrid



// do the splitting stuff here
function performImageSplit(contextIn, panelWidthIn, overlapWidthIn) {
	// copy the canvas
        // see http://blog.everythingfla.com/2014/09/html5-canvas-copy-region.html
        // Context,drawImage(canvas,sourceX,sourceY,sourceWidth,sourceHight,destX,destY,destWidth, destHeight);
        //contextIn.drawImage(canvas, 0, 0, 200,200, 250, 250, 200, 200);
        contextIn.save();
        
        var imgHeight = contextIn.canvas.height;
        // figure out bounds
        var center = contextIn.canvas.width/2;
        var leftEdgePositionX = center - panelWidthIn/2 - panelWidthIn;
        var leftEdgeSourceX = center - panelWidthIn/2 + overlapWidthIn - panelWidthIn;
        var rightEdgePositionX = center + panelWidthIn/2;
        var rightEdgeSourceX = center + panelWidthIn/2 - overlapWidthIn;
        
        // draw left side
        contextIn.drawImage(contextIn.canvas, leftEdgeSourceX, 0, panelWidthIn, imgHeight, leftEdgePositionX, 0, panelWidthIn, imgHeight);
        // draw right side
       contextIn.drawImage(contextIn.canvas, rightEdgeSourceX, 0, panelWidthIn, imgHeight, rightEdgePositionX, 0, panelWidthIn, imgHeight);
       contextIn.restore();
} // end performImageSplit




// do the mask stuff here
