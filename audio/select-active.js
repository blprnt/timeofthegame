inlets = 1;
outlets = 7;

var active = "british";

function set_active(a){
	if (a != active){
		if (a == "british"){
			active = "british";
			outlet(0, "active");
			outlet(1, "inactive");
			outlet(2, "inactive");
			outlet(3, "inactive");
			outlet(4, "inactive");
			outlet(5, "inactive");
			outlet(6, "inactive");
		} else if (a == "american"){
			active = "american";
			outlet(0, "inactive");
			outlet(1, "active");
			outlet(2, "inactive");
			outlet(3, "inactive");
			outlet(4, "inactive");
			outlet(5, "inactive");
			outlet(6, "inactive");
		} else if (a == "french"){
			active = "french";
			outlet(0, "inactive");
			outlet(1, "active");
			outlet(2, "inactive");
			outlet(3, "inactive");
			outlet(4, "inactive");
			outlet(5, "inactive");
			outlet(6, "inactive");
		} else if (a == "german"){
			active = "german";
			outlet(0, "inactive");
			outlet(1, "inactive");
			outlet(2, "active");
			outlet(3, "inactive");
			outlet(4, "inactive");
			outlet(5, "inactive");
			outlet(6, "inactive");
		} else if (a == "spanish"){
			active = "spanish";
			outlet(0, "inactive");
			outlet(1, "inactive");
			outlet(2, "inactive");
			outlet(3, "active");
			outlet(4, "inactive");
			outlet(5, "inactive");
			outlet(6, "inactive");
		} else if (a == "japanese"){
			active = "japanese";
			outlet(0, "inactive");
			outlet(1, "inactive");
			outlet(2, "inactive");
			outlet(3, "inactive");
			outlet(4, "active");
			outlet(5, "inactive");
			outlet(6, "inactive");
		} else if (a == "dutch"){
			active = "dutch";
			outlet(0, "inactive");
			outlet(1, "inactive");
			outlet(2, "inactive");
			outlet(3, "inactive");
			outlet(4, "inactive");
			outlet(5, "active");
			outlet(6, "inactive");
		} else if (a == "arabic"){
			active = "arabic";
			outlet(0, "inactive");
			outlet(1, "inactive");
			outlet(2, "inactive");
			outlet(3, "inactive");
			outlet(4, "inactive");
			outlet(5, "inactive");
			outlet(6, "active");
		}
	}
}