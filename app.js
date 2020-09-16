	// my code
	function isBuilding(v) {
			result =false; //default
			if ( v.tags.building == "yes" ) {result =true;};
			if ( v.tags.type == "buildings" ) {result =true;};
			if ( v.tags.type == "cliff" ) {result =false;};
			if ( v.tags.natural == "cliff" ) {result =false;};
			if ( v.tags.natural == "bare_rock" ) {result =false;};
			if ( v.tags.indoor == "yes" ) {result =true;};

			try {
			   oo=v.tags.opening_hours;
			   if ( v.tags.opening_hours.search(/.*sunset.*/) != -1 ) {result=false};
			} catch( err ) {

			}

			return result;

	}

	var LeafIcon = L.Icon.extend({
		options: {
			//shadowUrl: 'leaf-shadow.png',
			iconSize:     [40, 40]
		}
	});

	var outdoorIcon = new LeafIcon({iconUrl: 'outdoor.png'});
	var outdoorGreyIcon = new LeafIcon({iconUrl: 'outdoor_grey.png'});
	var buildingIcon = new LeafIcon({iconUrl: 'building.png'});
	var buildingFreeIcon = new LeafIcon({iconUrl: 'building_free.png'});

	var markers = L.markerClusterGroup({ chunkedLoading: true });

	var styleTags = new Map([["climbing:boulder","boulder"],["climbing:sport","sport"],["climbing:speed","speed"],["climbing:toprope","toprope"],["climbing:trad","traditional"],["climbing:multipitch","multi pitch"],["climbing:ice","ice climbing"],["climbing:mixed","mixed"],["climbing:deepwater","deepwater"]]);
	var hideTags = ["name","sport","building","opening_hours","operator","fee"];
	hideTags = hideTags.concat(Array.from(styleTags.keys()));
	hideTags = hideTags.concat(["climbing:length","climbing:length:min","climbing:length:max"]);
	hideTags = hideTags.concat(["climbing:routes","climbing:grade:uiaa","climbing:grade:uiaa:min","climbing:grade:uiaa:max","climbing:grade:uiaa:mean"]);
	hideTags = hideTags.concat(["climbing:bolted","climbing:bolts"]);
	hideTags = hideTags.concat(["addr:housename","addr:housenumber","addr:street","addr:city","addr:postcode","addr:country"]);
	hideTags = hideTags.concat(["website","url","wikipedia","wikidata"]);
	hideTags = hideTags.concat(["indoor","outdoor"]);

	  //alert(JSON.stringify(addressPoints.features[2]));
	for (var i = 0; i < addressPoints.elements.length; i++) {
	//for (var i = 0; i < 720; i++) {
		var a = addressPoints.elements[i];
		var title = "unnamed";
		var  lat = 52.1;
		var  lng = 8.7;
		var  tags = "";
		var  isClimbing = true;

		if (a.tags) {

			if (a.type == "node") {
			//alert(a.tags.length+0);
					lat = a.lat;
					lng = a.lon;
					if (a.tags.name) { title =  a.tags.name };
			}

		   if (a.type == "way") {
				for (var j = 0; j < addressPoints.elements.length; j++) {
					if  (addressPoints.elements[j].id == a.nodes[0]) {
						lat = addressPoints.elements[j].lat;
						lng = addressPoints.elements[j].lon;
						if (a.tags.name) { title = a.tags.name };
					}
				}
			}


			// Print details

			// Climbing style
			var styles = [];
			for (var [tag,value] of styleTags) {
				if (a.tags[tag] == "yes" || a.tags[tag] == "only") {
					styles.push(value);
				}
			}
			if (styles.length > 0){tags += "Climbing styles: " + styles.join(", ");}


			//UIAA
			var routes = a.tags["climbing:routes"];
			var plain = a.tags["climbing:grade:uiaa"];
			var min = a.tags["climbing:grade:uiaa:min"];
			var max = a.tags["climbing:grade:uiaa:max"];
			var mean = a.tags["climbing:grade:uiaa:mean"];
			if (routes) {tags+="</br>Routes: " + routes + ", ";} else if (plain || min || max) {tags += "</br>";}
			if (plain) {tags += "UIAA grade: " + plain;}
			else if (min || max) {
				tags += "UIAA grade: ";
				if (min && max) { tags += min + " - " + max;}
				else if (min) {tags += min + " and harder";}
				else {tags += "up to " + max;}
				if (mean) {tags += ", mean " + mean;}
			}


			// Climbing information
			var bolted = a.tags["climbing:bolted"];
			var bolts = a.tags["climbing:bolts"];
			if ((isNaN(bolted) && bolted == "yes") || !isNaN(bolted) || bolts > 0) {
				tags += "</br>Bolted: Yes";
				if (bolts && !isNaN(bolts)) {tags += " (" + bolts + " bolts)"}
			} else if (bolted == "no") {tags += "</br>Bolted: No";}



			//Hight
			var length = a.tags["climbing:length"];
			var lengthmin = a.tags["climbing:length:min"];
			var lengthmax = a.tags["climbing:length:max"];

			if (lengthmin || lengthmax) {
				tags += "</br>Length: ";
				if (lengthmin && lengthmax) { tags += lengthmin + " - " + lengthmax + "m";}
				else if (lengthmin) {tags += lengthmin  + "m and higher";}
				else {tags += "up to " + lengthmax + "m";}
			} else if (length){ tags += "</br>Length: " + length + "m";}


			//Indoor, Outdoor
			var outdoor = a.tags["outdoor"] == "yes";
			var indoor = a.tags["indoor"] == "yes";
			if (outdoor && indoor){tags += "</br>Indoor and outdoor climbing";}
			else if (indoor){tags += "</br>Indoor climbing";}
			else if (outdoor){tags += "</br>Outdoor climbing";}


			//Address
			var addr = [];
			var housename = a.tags["addr:housename"];
			var hn = a.tags["addr:housenumber"];
			var street = a.tags["addr:street"];
			var postcode = a.tags["addr:postcode"];
			var city = a.tags["addr:city"];
			var country = a.tags["addr:country"];
			if (housename) {addr.push(housename);}
			if (hn && street) {addr.push(street + " " + hn);}
			else if (street) {addr.push(street);}
			if (postcode && city) {addr.push(postcode + " " + city);}
			else if (city) {addr.push(city);}
			if (country) {addr.push(country);}
			if (addr.length > 0) {tags += "</br>" + addr.join(", ");}


			//opening_hours
			var opening = a.tags["opening_hours"];
			if (opening) {tags += "</br>" + opening;}


			//Internet
			var internet = []
			var web = a.tags["website"];
			var url = a.tags["url"];
			var wiki = a.tags["wikipedia"];

			if (web) {internet.push("<a target='_blank' href=\"" + web + "\">official website</a>");}
			if (url) {internet.push("<a target='_blank' href=\"" + url + "\">additional information</a>");}
			if (wiki) {internet.push("<a target='_blank' href=\"https://en.wikipedia.org/wiki/" + wiki + "\">Wikipedia</a>");}
			if (internet.length > 0) {tags += "</br>Links: " + internet.join(", ");}


			//Operator and fee
			var fee = a.tags["fee"];
			var operator = a.tags["opratator"];
			if (operator) {tags += "</br>Fee: " + fee;}
			if (operator) {tags += "</br>Operator: " + operator;}



			var osm = [];
			for (var tag in a.tags) {
				if (!hideTags.includes(tag)){
					osm.push(tag +"="+a.tags[tag]);
					if (tag.search(/climbing.+/) != -1){
					   if (tag =="climbing:sport" && a.tags[tag]=="no"){
						 isClimbing = false;
						}
					}
				}
			}
			if (osm.length > 0) {tags += "</br></br> Other OSM tags:</br>" + osm.join("</br>");}
			tags += "</br></br><a target=_blank href=\"https://osm.org/" + a.type + "/" + a.id + "\">OSM</a> <a target=_blank href=\"https://www.openstreetmap.org/edit?" + a.type + "=" + a.id + "\">iD</a> <a target=_blank href=\"http://127.0.0.1:8111/load_object?objects=" + a.type + a.id + "\">JOSM</a>"


			if ( isClimbing) {
				var marker;
				if (isBuilding(a)) {
					if (a.tags.fee == "no") {
						marker = L.marker(L.latLng(lat, lng), { title: title  ,icon: buildingFreeIcon });
					} else {
						marker = L.marker(L.latLng(lat, lng), { title: title  ,icon: buildingIcon });
					}
				} else {
					// Grey out closed and private climbing sites
					if (a.tags.access == "private" || a.tags.access == "no") {
						marker = L.marker(L.latLng(lat, lng), { title: title  ,icon: outdoorGreyIcon });
					} else {
						marker = L.marker(L.latLng(lat, lng), { title: title  ,icon: outdoorIcon });
					}
				}
				marker.bindPopup("<h2>"+title+"</h2>"+tags);
				markers.addLayer(marker);
			}
		}
	}

	map.addLayer(markers);
