

$(window).load(function() {

	$('#find').click(function(event){
		var endpoint = $('#ep').val();
		var query = $('#query').val();

		qr = sendQuery(endpoint, query);

		qr.fail(
				function (xhr, textStatus, thrownError) {
					alert("Error: A '" + textStatus+ "' occurred.");
				}
			);
		qr.done(
			function (d) {
				viewResult(d);

			}
		);

	});

	$('#findLoc').click(function(event){
		find_from_location($('#lat').val(), $('#lng').val(), viewLocationResult);
	});

});


var viewResult = function(d){
	var result_div = $('#result_div');

	var table = $('#result_list')[0];

	if (table == undefined){
		table = $("#" + result_div.id + '_list')[0];

		if (table == undefined){
			result_div.append(
					$('<table></table>')
					.attr({
						'id': result_div.id + '_list',
						'class': 'table'
					})
			);
			table = $("#" + result_div.id + '_list')[0];
		}
	}

	while(table.rows.length > 0){
		table.deleteRow(0);	// 行を追加
	}

	if (d.head != undefined && d.head.vars != null){
		var header = table.createTHead();	// 行を追加
		var headerRow = header.insertRow(0);

		for (var i=0; i<d.head.vars.length; i++){
			var th = document.createElement('th');
			th.innerHTML = d.head.vars[i]; // ID
			headerRow.appendChild(th);
		}
	}

	if (d.results != undefined && d.results.bindings instanceof Array){
		var data = d.results.bindings;
		result_div.show();
		// ヘッダ

		id = 1;
		for (var d=0; d<data.length; d++){
			var row1 = table.insertRow(d+1);	// 行を追加


			var i=0;
			// ID
			for (var key in data[d]) {
				var cell = row1.insertCell(i++);	// ２つ目以降のセルを追加
				var value = data[d][key].value;

				if (value == null){
					value = '';
				}

				var link = true;

				if (link){
					if (value != null && value.indexOf("http://") == 0){
						value = '<a href="'+value+'" target="_blank">'+value+'</a>';
					}
				}
				cell.innerHTML = value;
			}
		}
	}
};



var viewLocationResult = function(d, lat, lng){
	 var result_div = $('#result_div');

	 var table = $('#result_list')[0];

	 if (table == undefined){
		 table = $("#" + result_div.id + '_list')[0];

		 if (table == undefined){
			 result_div.append(
					 $('<table></table>')
					 .attr({
						 'id': result_div.id + '_list',
						 'class': 'table'
					 })
			 );
			 table = $("#" + result_div.id + '_list')[0];
		 }
	 }

	 while(table.rows.length > 0){
		 table.deleteRow(0);	// 行を追加
	 }

	 if (d.head != undefined && d.head.vars != null){
		 var header = table.createTHead();	// 行を追加
		 var headerRow = header.insertRow(0);

		 for (var i=0; i<d.head.vars.length; i++){
			 var th = document.createElement('th');
			 th.innerHTML = d.head.vars[i];
			 headerRow.appendChild(th);
		 }
		 var th = document.createElement('th');
		 th.innerHTML = 'distance(km)';
		 headerRow.appendChild(th);

	 }

	 if (d.results != undefined && d.results.bindings instanceof Array){
		 var data = d.results.bindings;
		 result_div.show();
		 // ヘッダ

		 id = 1;
		 for (var d=0; d<data.length; d++){
			 var row1 = table.insertRow(d+1);	// 行を追加


			 var i=0;
			 // ID
			 for (var key in data[d]) {
				 var cell = row1.insertCell(i++);	// ２つ目以降のセルを追加
				 var value = data[d][key].value;

				 if (value == null){
					 value = '';
				 }

				 var link = true;

				 if (link){
					 if (value != null && value.indexOf("http://") == 0){
						 value = '<a href="'+value+'" target="_blank">'+value+'</a>';
					 }
				 }
				 cell.innerHTML = value;
			 }
			 var cell = row1.insertCell(i++);	// ２つ目以降のセルを追加
			 var lat0 = data[d].lat.value;
			 var lng0 = data[d].lng.value;

			 var distance = calc_distance(lat, lng, lat0, lng0);
			 cell.innerHTML = Math.round(distance/100) / 10;

		 }
	 }
};