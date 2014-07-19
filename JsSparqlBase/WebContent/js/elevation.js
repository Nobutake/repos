
function find_geotype(lat, lng, cb) {

	  var elevator = new google.maps.ElevationService();

	  // Create a new chart in the elevation_chart DIV.
	  chart = new google.visualization.ColumnChart(document.getElementById('elevation_chart'));

	//  var path = [ whitney, lonepine, owenslake, panamintsprings, beattyjunction, badwater];
	  var path = [];
	  for (var i=0; i<10; i+=2){
		  path.push(new google.maps.LatLng(lat - 0.005 , lng - 0.001 * i + 0.005));
		  path.push(new google.maps.LatLng(lat + 0.005 , lng - 0.001 * i + 0.005));
		  path.push(new google.maps.LatLng(lat + 0.005 , lng - 0.001 * (i+1) + 0.005));
		  path.push(new google.maps.LatLng(lat - 0.005 , lng - 0.001 * (i+1) + 0.005));
	  }

	  // Create a PathElevationRequest object using this array.
	  // Ask for 256 samples along that path.
	  var pathRequest = {
	    'path': path,
	    'samples': 100
	  };

	  // Initiate the path request.
	  elevator.getElevationAlongPath(pathRequest, function(results, status){
		  if (cb != undefined){
			  return cb(getElevations(results, status), lat, lng);
		  }
	  });
}


function getElevations(results, status, cb) {
	var types = [];

	if (status == google.maps.ElevationStatus.OK) {
		elevations = results;

		// Extract the elevation samples from the returned results
		// and store them in an array of LatLngs.
		var elevationPath = [];
		var max = -10000;
		var min = 10000;
		var eles = [];

		for (var i = 0; i < results.length; i++) {
			elevationPath.push(elevations[i].location);
			eles.push(elevations[i].elevation);
		}

		eles.sort(
				function(a,b){
					if( a < b ) return -1;
					if( a > b ) return 1;
					return 0;
				}
		);

		var uniques = eles.filter(function (x, i, self) {
			return self.indexOf(x) === i;
		});


		max = eles[eles.length - 1];
		min = eles[0];

		if (min <= -1 || (max - min < 2) || uniques.length < 95){
			types.push('水辺');
		}
		if (max > 500){
			types.push('高地');
		}
	}

	return types;
}

