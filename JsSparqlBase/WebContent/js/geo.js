


/*
 * 二点の座標を指定して距離を算出する
 * from http://emiyou3-tools.appspot.com/geocoding/distance.html
 */
var calc_distance = function(lat1, lon1, lat2, lon2){
     //ラジアンに変換
     var a_lat = lat1 * Math.PI / 180;
     var a_lon = lon1 * Math.PI / 180;
     var b_lat = lat2 * Math.PI / 180;
     var b_lon = lon2 * Math.PI / 180;

     // 緯度の平均、緯度間の差、経度間の差
     var latave = (a_lat + b_lat) / 2;
     var latidiff = a_lat - b_lat;
     var longdiff = a_lon - b_lon;

     //子午線曲率半径
     //半径を6335439m、離心率を0.006694で設定
     var meridian = 6335439 / Math.sqrt(Math.pow(1 - 0.006694 * Math.sin(latave) * Math.sin(latave), 3));

     //卯酉線曲率半径
     //半径を6378137m、離心率を0.006694で設定
     var primevertical = 6378137 / Math.sqrt(1 - 0.006694 * Math.sin(latave) * Math.sin(latave));

     //Hubenyの簡易式
     var x = meridian * latidiff;
     var y = primevertical * Math.cos(latave) * longdiff;

     return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
 };

/**
 * 座標を指定して、その位置から近い順にリソースをコールバック関数に返す
 * @param lat	lat
 * @param lng	long
 * @param cb	処理完了後のコールバック func(result, lat, lng)
 */
var find_from_location = function(lat, lng, cb){

	var endpoint = $('#ep').val();

	var query =
		'select distinct ?s ?name ?lat ?lng {\n'+
' ?s <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat;\n'+
' <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?lng;\n'+
'  <http://www.w3.org/2000/01/rdf-schema#label> ?name.\n'+
' }\n'+
' ORDER BY (((?lat - ' + lat + ') * (?lat - ' + lat + ')) + ((?lng - ' + lng + ') * (?lng - ' + lng + '))) \n'+
'  LIMIT 100';


	qr = sendQuery(endpoint, query);

	qr.fail(
			function (xhr, textStatus, thrownError) {
				alert("Error: A '" + textStatus+ "' occurred.");
			}
		);
	qr.done(
		function (d) {
			if (cb != undefined){
				cb(d, lat, lng);
			}
		}
	);
 };

 // 以前作成した、現在地の種別情報取得funcはこのファイルに記述？
