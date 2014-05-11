	// my code
	function isBuilding(v) {
			result =false; //default
			if ( v.tags.building == "yes" ) {result =true;};
			if ( v.tags.type == "buildings" ) {result =true;};
			if ( v.tags.type == "cliff" ) {result =false;};
			if ( v.tags.natural == "cliff" ) {result =false;};
			if ( v.tags.natural == "bare_rock" ) {result =false;};

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
	var buildingIcon = new LeafIcon({iconUrl: 'building.png'});

	var markers = L.markerClusterGroup({ chunkedLoading: true });

	  //alert(JSON.stringify(addressPoints.features[2]));
	for (var i = 0; i < addressPoints.elements.length; i++) {
	//for (var i = 0; i < 720; i++) {
		var a = addressPoints.elements[i];
		var title = "unnamed";
		var  lat = 52.1;
		var  lng = 8.7;
		var  tags = "";
		var  isCool = false;
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
			
		
			//tags =JSON.stringify(a.tags);
			for (var tag in a.tags) {
				tags += "<br>" +tag +"="+a.tags[tag];
				if (tag.search(/climbing.+/) != -1){
				   title = "*" + title;
				   isCool=true;
				   if (tag =="climbing:sport" && a.tags[tag]=="no"){
					 isClimbing = false;
					}
				}
											
			}
			
			
			if (title == "unnamed") {
			 isCool=false;
			
			}

			if ( isClimbing) {
				var marker;
				if (isBuilding(a)) {
					marker = L.marker(L.latLng(lat, lng), { title: title  ,icon: buildingIcon });
				} else {
					marker = L.marker(L.latLng(lat, lng), { title: title  ,icon: outdoorIcon });
				}
				marker.bindPopup("<h2>"+title+"</h2>"+tags);
				markers.addLayer(marker);
			}
		}
	}

	map.addLayer(markers);