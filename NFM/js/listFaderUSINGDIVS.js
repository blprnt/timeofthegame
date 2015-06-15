var listFaderRightPos = 70;
var listFaderTopPos = 30;

var listFader = null;
var animationTime = 1000;

// ****** change this to change the max number of list items displayed before auto-fading out ****** //
var maximumListLength = 6; // anything over this will be auto-killed



//
function ListFader(faderDivIn, animationTimeIn, screenWidthIn, screenHeightIn, topPaddingIn, rightPaddingIn){
	var faderDiv = faderDivIn;
	var listItems = [];
	var listItemMaxAlpha = 1; // from 0 to 1
	var animationTime = animationTimeIn;
	var screenWidth = screenWidthIn;
	var screenHeight = screenHeightIn;
	var topPadding = topPaddingIn;
	var rightPadding = rightPaddingIn;



	var uniqueDivId = 10000000; // for new ListItem divs

	// keep track of the centering of the listItems
	var centering = 0 // 0 for all the way to the right, 1000 for middle 
	// see http://stackoverflow.com/questions/10266877/in-jquery-animate-how-do-i-use-a-custom-object-instead-of-a-div



	// set the position of the div
	// load thee imageDescription placement
	
	faderDiv.css({
		top : topPadding + "px",
		right : rightPadding + "px",
		width: (screenWidthIn - 2 * rightPadding) + "px"
	})


	//
	this.getListItemsLength = function() {
		var len = listItems.length;
		if (len == null) len = 0;
		return len;
	} // end getListItemsLength

	// toggle the image description div
	this.shiftFader = function(centerIt) {
		if (centerIt) {	
			// http://stackoverflow.com/questions/12317523/jquery-animate-variable-value
			$('#dummy').animate({
				'height':'1000px'
			}, {
				duration:animationTime,
				easing:'easeInOutQuart',
				step: function(now, fx) {
					centering = now / 1000 * 999 + 1;
				}
			})		
		} else {
			
			$('#dummy').animate({
				'height':'0px'
			}, {
				duration:animationTime,
				easing:'swing',
				step: function(now, fx) {
					centering = now / 1000 * 999 + 1;
				}
			})		
		}
	}// end shiftFader

	//
	this.update = function(currentTime) {
		// update the alphas for all ListItems
		// and remove any dead ones
		for (var i = listItems.length - 1; i >= 0; i--) {
			listItems[i].update(currentTime, centering);
			if (listItems[i].okToDie(currentTime)) {
				listItems[i].cleanup();
				listItems.splice(i, 1);
				//console.log("removed item at index: " + i + " total size of listItems is now: " + listItems.length);
			}
		}
	} // end update

	//
	//
	this.createNewListItem = function(name, currentTime, itemDuration) {
		//console.log("going to create a new list item for new String: " + name + " current size of list items is: " + listItems.length);
		// check if it is at the top of the stack or not
		if (listItems.length > 0 && listItems[listItems.length - 1].getName() == name) {
			// is at the top
			var timeLeft = listItems[listItems.length - 1].getHowMuchTimeIsLeft(currentTime);
			var newLifeExtension = listItems[listItems.length - 1].getLife() - timeLeft;
			listItems[listItems.length - 1].extendLife(newLifeExtension);
		} else {
			// not at the top, make a new one
			// see this: http://stackoverflow.com/questions/10619445/the-prefered-way-of-creating-a-new-element-with-jquery
			var listItemDiv = $("<div>", {id: uniqueDivId, class:"FaderListItem"});
			listItemDiv.css( {
				//"background-color":"#e5a", 
				//color:"#a03",
				position:"absolute",
				//height:listItemDivHeight + 'px',
				//"text-align":"center",
				//width:faderDiv.css("width") ,
				opacity:0,
			})

			// add this div to the overall div
			faderDiv.append(listItemDiv);
			// change the text in that new div.  use toTitleCase
			listItemDiv.html(toTitleCase(name));
			// make a new ListItem with the div
			var position = new Object();
			position.x = 0;
			position.y = 0;
			var newListItem = new ListItem(listItemDiv, uniqueDivId, faderDiv, name, position, currentTime, itemDuration, listItemMaxAlpha);

			// find the width of the text
			var thisDivWidth = listItemDiv.width();
			//console.log("thisDivWidth: " + thisDivWidth);
			newListItem.setDivWidth(thisDivWidth);

			var divHeight = (listItemDiv.css("height"));
			divHeight = divHeight.replace("px", "");
			divHeight = +divHeight;// don't forget to add a plus to make it a number
			
			// push all existing listItem divs down
			for (var i = 0; i < listItems.length; i++) {
				var oldPosition = listItems[i].getTargetPosition();
				var newTargetPosition = new Object();
				newTargetPosition.x = oldPosition.x;
				newTargetPosition.y = oldPosition.y + divHeight; 
				listItems[i].assignTargetPosition(newTargetPosition)
			}
			// then add this one to the array
			listItems.push(newListItem);			
			uniqueDivId++;

			// kill off any over the max
			for (var i = 0; i < listItems.length - maximumListLength; i++) {
				listItems[i].kill();
			}
		}
	} // end createNewListItem

	//
	this.killAllListItems = function() {
		console.log("GOING TO KILL ALL LIST ITEMS");
		for (var i = 0; i < listItems.length; i++) listItems[i].kill();
	} // end killAllListItems
} // end class ListFader



//
//
//
//
function ListItem(divIn, divIdIn, parentDivIn, nameIn, positionIn, conceptionIn, lifeIn, alphaMaxIn) {
	var parentDiv = parentDivIn;
	var listDiv = divIn;
	var divId = divIdIn;
	var divWidth = 0;
	var name = nameIn;
	var position = positionIn;
	var targetPosition = positionIn;
	var positionSpeed = .14;
	var conception = conceptionIn;
	var life = lifeIn; // how long to actually stay active in milliseconds
	var lifeExtension = 0;
	var alphaMax = alphaMaxIn;
	var alphaIncrease = .1;
	var alphaDecrease = .01;
	var alpha = 0;
	var reachedMax = false; // after alpha gets to alphaMax this is set to true
	// reachedMax is used when kill is on to ensure that it at least lights up and is never killed before it reaches max brightness
	var kill = false; // can be automatically set to be destroyed


//console.log("made new listItem with divID of: " + divId + " and alpha as: " + alpha +" maxAlpha: " + alphaMax + " name: "+ name + " conception: " + conception);


	//
	this.getName = function() {
		return name;
	} // end getName

	//
	this.getLife = function() {
		return life;
	}// end getLife

	//
	this.getLifeExtension = function() {
		return lifeExtension;
	} // end getLifeExtension

	//
	this.getHowMuchTimeIsLeft = function(currentTimeIn) {
		return (conception + life + lifeExtension ) - (currentTimeIn);
	} // end getHowMuchTimeIsLeft

	//
	this.getPosition = function() {
		return position;
	} // end getPosition

	//
	this.getTargetPosition = function() {
		return targetPosition;
	} // end getTargetPosition

	//
	this.setDivWidth = function(wIn) {
		divWidth = wIn;
	} // end setDivWidth

	//
	this.assignTargetPosition = function(targetPositionIn) {
		targetPosition = targetPositionIn;
		if (targetPosition.x != position.x || targetPosition.y != position.y) active = true;
	} // end assignTargetPosition

	//
	// centering is passed from parent ListFader obj
	this.update = function(currentTimeIn, centeringIn) {
		// change alpha
		if (!reachedMax || (!kill && currentTimeIn > conception && currentTimeIn < conception + life + lifeExtension)) {
			alpha += alphaIncrease;
		} else {
			alpha -= alphaDecrease;
		}
		if (alpha >= alphaMax) {
			alpha = alphaMax;
			reachedMax = true; // mark when it has reached max alpha value
		}
		else if (alpha < 0) alpha = 0;
		
		// change position
		// add in centering
		//position.x += positionSpeed * (targetPosition.x - position.x);
		position.x = ((-divWidth + parentDiv.width() )/ 2)   * (centeringIn / 1000);
		position.y += positionSpeed * (targetPosition.y - position.y);

		// update css with position and alpha
		listDiv.css ({
			opacity: alpha,
			top:position['y'] + "px",
			right:position['x'] + "px",
		});
	} // end update

	//
	this.extendLife = function(extensionTimeIn) {
		lifeExtension += extensionTimeIn;
		reachedMax = false; // reset this just in case the alpha is < max
		//console.log("extending life for ListItem: " + name);
	} // end extendLife

	//
	this.kill = function() {
		kill  = true;
		//console.log ("TRYING TO KILL OFF this list item: " + name);
	} // end kill

	//
	// remove the div  from the dom
	this.cleanup = function() {
		$('#' + divId).remove();
	} // end cleanup

	//
	this.okToDie = function(currentTimeIn) {
		if (alpha <= 0 && currentTimeIn - conception > 100) return true;
		return false;
	} // end okToDie

	//
	this.shiftFader = function() {

	} // end shiftFader
} // end class ListItem


