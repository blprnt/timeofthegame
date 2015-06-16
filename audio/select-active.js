inlets = 1;
outlets = 7;

var active = "NULL";
var lastX= false;

var randomLanguages = { 0 : "Spanish-1",
				 	    1 : "Spanish-2",
				 		2 : "German",
				 		3 : "Bulgarian",
				 		4 : "FrAbSp"} ;
				
function set_active(a){
	post(lastX);
	if (a == "x" && !lastX){
		lastX = true;
		post("X and not LastX");
		output(a);
	} else if (a != "x"){
		lastX = false;
		post("false, not X");
		output(a)
	}
}

function output(a){
	if (a != active){
		if (a == "English-1"){
			active = "English-1";
			outlet(0, "active");
			outlet(1, "inactive");
			outlet(2, "inactive");
			outlet(3, "inactive");
			outlet(4, "inactive");
			outlet(5, "inactive");
			outlet(6, "inactive");
		} else if (a == "English-2"){
			active = "English-2";
			outlet(0, "inactive");
			outlet(1, "active");
			outlet(2, "inactive");
			outlet(3, "inactive");
			outlet(4, "inactive");
			outlet(5, "inactive");
			outlet(6, "inactive");
		} else if (a == "Spanish-1"){
			active = "Spanish-1";
			outlet(0, "inactive");
			outlet(1, "inactive");
			outlet(2, "active");
			outlet(3, "inactive");
			outlet(4, "inactive");
			outlet(5, "inactive");
			outlet(6, "inactive");
		} else if (a == "Spanish-2"){
			active = "Spanish-2";
			outlet(0, "inactive");
			outlet(1, "inactive");
			outlet(2, "inactive");
			outlet(3, "active");
			outlet(4, "inactive");
			outlet(5, "inactive");
			outlet(6, "inactive");
		} else if (a == "German"){
			active = "German";
			outlet(0, "inactive");
			outlet(1, "inactive");
			outlet(2, "inactive");
			outlet(3, "inactive");
			outlet(4, "active");
			outlet(5, "inactive");
			outlet(6, "inactive");
		} else if (a == "Bulgarian"){
			active = "Bulgarian";
			outlet(0, "inactive");
			outlet(1, "inactive");
			outlet(2, "inactive");
			outlet(3, "inactive");
			outlet(4, "inactive");
			outlet(5, "active");
			outlet(6, "inactive");
		} else if (a == "FrAbSp"){
			active = "FrAbSp";
			outlet(0, "inactive");
			outlet(1, "inactive");
			outlet(2, "inactive");
			outlet(3, "inactive");
			outlet(4, "inactive");
			outlet(5, "inactive");
			outlet(6, "active");
		} else if (a == "x"){
			pickRandomLanguage();
		}
	}
}

function pickRandomLanguage(){
	languageChoice = Math.floor(Math.random() * 5);
	output(randomLanguages[languageChoice]);
	post(randomLanguages[languageChoice]);
}