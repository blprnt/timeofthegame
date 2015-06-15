inlets = 1;
outlets = 7;

var active = "NULL";

var languages = {0 : "English-1",
				 1 : "English-2",
				 2 : "Spanish-1",
				 3 : "Spanish-2",
				 4 : "German",
				 5 : "Bulgarian",
				 6 : "FrAbSp"} 

function set_active(a){
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
		} else if (a == "X"){
			pickRandomLanguage();
		}
	}
}

function pickRandomLanguage(){
	languageChoice = Math.floor((Math.random * 8));
	set_active(languages[languageChoice]);
}