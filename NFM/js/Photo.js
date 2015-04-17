// this is the Photo object
//
function Photo(loc, alphaMax, delay, displayTimeInSeconds, conception, imageCorners) {
	var image = new Image();

	var url;
	this.location = loc; // the city/place/etc.

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

	//
	this.getImage = function() {
		return this.image;
	} // end getImage

	//
	this.getAlpha = function() {
		return this.alpha;
	} // end getAlpha

	//
	// assume that it takes a little time to load, so this will adjust the time afterwards
	this.setNewConception = function(val) {
		this.conception = val;
		// don't forget to add in the delay
		this.conception += this.delay;
		actuallyLoadedImage = true;
	} // end setNewConception

	//
	this.getConception = function() {
		return this.conception;
	} // end getConception

	//
	this.getDisplayTimeInSeconds = function() {
		return this.displayTimeInSeconds;
	} // end getDisplayTime

	// 
	this.getLocation = function() {
		return this.location;
	} // end getLocation

	//
	this.getImageCorners = function() {
		return imageCorners;
	} // end getImageCorners

	//
	this.setToDie = function(currentTime) {
		if (!this.okToDie) this.okToDieTime = currentTime;
		this.okToDie = true;
	} // end setToDie

	//
	this.getOkToDie = function() {
		return this.okToDie;
	} // end getToDie

	//
	this.setDelay = function(val) {
		this.delay = val;
	} // end setDelay

	// check whether or not to fire on the label
	this.shouldFireFaderLabel = function() {
		if (!firedFaderLabelAlready && triggered) return true;
		return false;
	} // end shouldFireFaderLabel

	// // trimmed and such
	this.getFaderLabel = function() {
		firedFaderLabelAlready = true; // toggle to true;
		// modify etc.
		if (this.location != " " && this.location != "" && this.location != null) return this.location.toLowerCase().replace('.', '');
		else return (" ");
	} // end getFaderLabel


	// update this photo
	this.update = function(currentTime) {
		//this.alpha = 1; // reset it
			// figure the alpha here
			// cooling down or didnt load the thing yet
			if (!actuallyLoadedImage) {
				this.alpha = 0;
			}
			else if (this.okToDie) {
				// if it is set to manually die then take the time since last frame and use that against the total fade time to fade the img out
				//this.alpha -= ((currentTime - this.okToDieTime) / ( 1000 *imageFadeOutTimeInSeconds)) * alphaMax;
				//this.okToDieTime = currentTime;
				this.alpha -= .01;
			}
			else if (currentTime >= this.conception + 1000 * (imageWarmupTimeInSeconds + this.displayTimeInSeconds )) {
				this.alpha = mathMap(currentTime, this.conception+ 1000 * (imageWarmupTimeInSeconds + this.displayTimeInSeconds), this.conception+ 1000 * (imageWarmupTimeInSeconds + this.displayTimeInSeconds + imageFadeOutTimeInSeconds), this.alphaMax, 0);
			}
			// warming up
			else if (currentTime < this.conception) {
				this.alpha = 0;
			} else if (currentTime >= this.conception && currentTime < this.conception + 1000 * imageWarmupTimeInSeconds) {
				this.alpha = mathMap(currentTime, this.conception,  this.conception+ 1000 * imageWarmupTimeInSeconds, 0, this.alphaMax);
				// temp mark out when it was first triggered
				if (!triggered) {
					//console.log("triggered image: " + url + " -- loc: " + this.location);
					triggered = true;
				}				
			}
			// pausing
		//else if (currentTime >= this.conception+ 1000 * imageWarmupTimeInSeconds && currentTime < this.conception + 1000 * (imageWarmupTimeInSeconds + this.displayTime)) {
			else {
				this.alpha = this.alphaMax;
			}

			if (this.alpha < 0)
				this.alpha = 0;
			if (this.alpha > this.alphaMax) this.alpha = this.alphaMax;
	} // end update

	this.renderImage = function() {
		if (this.alpha > 0) { 
			var corners_in = [[imageCorners[0], imageCorners[1]], [imageCorners[2], imageCorners[3]], [imageCorners[4], imageCorners[5]], [imageCorners[6], imageCorners[7]]];

			var scale = 800 / Math.max(image.width, image.height);

			var m = new qlib.Matrix(scale, 0, 0, scale, (800 - image.width * scale) * 0.5, (800 - image.height * scale) * 0.5);

			var helperHandles = [[m.tx, m.ty], [m.tx + image.width * scale, m.ty], [m.tx + image.width * scale, m.ty + image.height * scale], [m.tx, m.ty + image.height * scale], [], [], [], []]

			var invMat = m.invert();

			var b = getBarycentric(helperHandles[0], corners_in[0], corners_in[1], corners_in[3]);
			setProjectedCorner(corners_out[0], corners_out[1], corners_out[3], b, helperHandles[4]);

			b = getBarycentric(helperHandles[1], corners_in[1], corners_in[2], corners_in[0]);
			setProjectedCorner(corners_out[1], corners_out[2], corners_out[0], b, helperHandles[5]);

			b = getBarycentric(helperHandles[2], corners_in[2], corners_in[3], corners_in[1]);
			setProjectedCorner(corners_out[2], corners_out[3], corners_out[1], b, helperHandles[6]);

			b = getBarycentric(helperHandles[3], corners_in[3], corners_in[0], corners_in[2]);
			setProjectedCorner(corners_out[3], corners_out[0], corners_out[2], b, helperHandles[7]);

			var w = image.width;
			var h = image.height;

			var v = [helperHandles[4][0], helperHandles[4][1], helperHandles[5][0], helperHandles[5][1], helperHandles[6][0], helperHandles[6][1], helperHandles[7][0], helperHandles[7][1], corners_out[0][0], corners_out[0][1], corners_out[1][0], corners_out[1][1], corners_out[2][0], corners_out[2][1], corners_out[3][0], corners_out[3][1]];

			v.push((v[0] + v[2]) * 0.5, (v[1] + v[3]) * 0.5);
			v.push((v[2] + v[4]) * 0.5, (v[3] + v[5]) * 0.5);
			v.push((v[4] + v[6]) * 0.5, (v[5] + v[7]) * 0.5);
			v.push((v[6] + v[0]) * 0.5, (v[7] + v[1]) * 0.5);

			v.push((v[8] + v[10] + v[12] + v[14]) * 0.25, (v[9] + v[11] + v[13] + v[15]) * 0.25);

			var uv = [0, 0, 1, 0, 1, 1, 0, 1, (corners_in[0][0] * invMat.a + invMat.tx) / w, (corners_in[0][1] * invMat.d + invMat.ty) / h, (corners_in[1][0] * invMat.a + invMat.tx) / w, (corners_in[1][1] * invMat.d + invMat.ty) / h, (corners_in[2][0] * invMat.a + invMat.tx) / w, (corners_in[2][1] * invMat.d + invMat.ty) / h, (corners_in[3][0] * invMat.a + invMat.tx) / w, (corners_in[3][1] * invMat.d + invMat.ty) / h];

			uv.push((uv[0] + uv[2]) * 0.5, (uv[1] + uv[3]) * 0.5);
			uv.push((uv[2] + uv[4]) * 0.5, (uv[3] + uv[5]) * 0.5);
			uv.push((uv[4] + uv[6]) * 0.5, (uv[5] + uv[7]) * 0.5);
			uv.push((uv[6] + uv[8]) * 0.5, (uv[7] + uv[9]) * 0.5);
			uv.push((uv[8] + uv[10] + uv[12] + uv[14]) * 0.25, (uv[9] + uv[11] + uv[13] + uv[15]) * 0.25);

			var idc = [0, 8, 4, 8, 5, 4, 1, 5, 8, 9, 5, 1, 6, 5, 9, 2, 6, 9, 10, 6, 2, 7, 6, 10, 3, 7, 10, 11, 7, 3, 4, 7, 11, 0, 4, 11, 4, 5, 12, 5, 6, 12, 6, 7, 12, 7, 4, 12];

			var context = output.getContext('2d');

			for (var t = 0; t < idc.length; t += 3) {
				var i0 = idc[t] << 1;
				var i1 = idc[t + 1] << 1;
				var i2 = idc[t + 2] << 1;

				var x0 = v[i0], x1 = v[i1], x2 = v[i2];
				var y0 = v[i0 + 1], y1 = v[i1 + 1], y2 = v[i2 + 1];

				var u0 = uv[i0] * w, u1 = uv[i1] * w, u2 = uv[i2] * w;
				var v0 = uv[i0 + 1] * h, v1 = uv[i1 + 1] * h, v2 = uv[i2 + 1] * h;

				var delta = 1 / (u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2);
				var delta_a = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
				var delta_b = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
				var delta_c = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2 - v0 * u1 * x2 - u0 * x1 * v2;
				var delta_d = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
				var delta_e = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
				var delta_f = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2 - v0 * u1 * y2 - u0 * y1 * v2;

				context.save();
				context.globalAlpha = this.alpha;

				context.beginPath();
				context.moveTo(x0, y0);
				context.lineTo(x1, y1);
				context.lineTo(x2, y2);
				context.closePath();
				context.clip();

				context.transform(delta_a * delta, delta_d * delta, delta_b * delta, delta_e * delta, delta_c * delta, delta_f * delta);
				context.drawImage(image, 0, 0);
				context.restore();
				} // end for
		} // end if alpha > 0
	} // end renderImage
} // end class Photo



// FUNCTIONS FOR WARPING
//
function getBarycentric(p, p1, p2, p3) {
	var l = 1 / ((p2[1] - p3[1]) * (p1[0] - p3[0]) + (p3[0] - p2[0]) * (p1[1] - p3[1]));
	var l1 = ((p2[1] - p3[1]) * (p[0] - p3[0]) + (p3[0] - p2[0]) * (p[1] - p3[1]) ) * l;
	var l2 = ((p3[1] - p1[1]) * (p[0] - p3[0]) + (p1[0] - p3[0]) * (p[1] - p3[1]) ) * l;
	return [l1, l2, 1 - l1 - l2];
} // end getBarycentric

//
function setProjectedCorner(p1, p2, p3, bary, target) {
	target[0] = bary[0] * p1[0] + bary[1] * p2[0] + bary[2] * p3[0];
	target[1] = bary[0] * p1[1] + bary[1] * p2[1] + bary[2] * p3[1];
} // end setProjectedCorner



// OTHER FUNCTIONS
//
function debugImage(image, corners_in, alpha) {
	var context = output.getContext('2d');
	context.save();
	context.drawImage(image, 0, 0);
	context.strokeStyle = "white";
	context.beginPath();
	context.moveTo(corners_in[0], corners_in[1]);
	context.lineTo(corners_in[2], corners_in[3]);
	context.lineTo(corners_in[4], corners_in[5]);
	context.lineTo(corners_in[6], corners_in[7]);

	context.closePath();
	context.stroke();
	context.restore();
}// end debugImage



//
// use the url as an identifier
// run through existing photos,, then
// adjust the conceptiontime to be now
function didLoadImage(url) {
	//console.log("loaded image " + url);
	for (var i = 0; i < currentPhotos.length; i++) {
		if (currentPhotos[i].getSRC() == url) {
			//console.log("found image for source: " + url + " at: " + currentPhotos[i].getSRC());
			// check the time difference:
			var currentTime = getCurrentTime();
			//var photoTime = currentPhotos[i].getConception();
			currentPhotos[i].setNewConception(currentTime);
			break;
		}
	}
} // end didLoadImage


