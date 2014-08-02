/**
 *
 */

var sparql_ns = 'http://umania.kiteretz.com';

var gdocs_url = 'https://docs.google.com/spreadsheet/ccc?key=1PeJXocWTGSoqWOESPscsvE9GZ5UxDjYmH5ZxgGbdrbM&usp=drive_web';

//付加情報（必須ではないもの）の名前とgoogledocsのカラム名を記述
var resource = [];
resource['discoveredYear'] = '年月日開始'; // 発見年
resource['popularity'] = 'googleヒット'; // 人気度
resource['category'] = 'カテゴリ'; // カテゴリ


var gdocs_resources;

$(window).load(function() {

	recline.Backend.GDocs.fetch({
	  url: gdocs_url
	})
	  .done(function(result) {
	    // structure of result is below
	    console.log(result);
	    init_gdocs(result);
	  });

	function init_gdocs(result){
		gdocs_resources = [];
		result = result.records;
		for (var i=0; i<result.length; i++){
			var res = {};
			res['name'] = result[i]['名前'];
			res['lat'] = result[i]['場所緯度'];
			res['lng'] = result[i]['場所経度'];
			for (var key in resource){
				res[key] = result[i][resource[key]];
			}
			gdocs_resources.push(res);
		}
		var a;
	}
});


/**
 * 名前が部分一致したリソースをコールバック関数に返す
 * @param cb	処理完了後のコールバック func(result, lat, lng)
 * @param maxCount	結果最大数(未指定の場合は全て)
 */
var find_from_name = function(endpoint, name, cb, maxCount, lang){

	var ret = [];

	for (var i=0; i<gdocs_resources.length; i++){
		var res = gdocs_resources[i];
		if (res[name].indexOf(name) >= 0){
			ret.push(res);
		}
	}

	ret = makeDummyResultFromArray(ret, maxCount);

	return ret;
 };

/**
 * 座標を指定して、その位置から近い順にリソースをコールバック関数に返す
 * @param endpoint	エンドポイント
 * @param lat	lat
 * @param lng	long
 * @param cb	処理完了後のコールバック func(result, lat, lng)
 * @param maxCount	結果最大数(未指定の場合は全て)
 */
var find_from_location = function(endpoint, lat, lng, cb, maxCount){

	for (var i=0; i<gdocs_resources.length; i++){
		var res = gdocs_resources[i];
		var distance = calc_distance(lat, lng, res.lat, res.lng);
		res.distance = distance;
	}

	var ret = gdocs_resources.concat();

	ret.sort(function(a, b){
		return ( a.distance > b.distance ? 1 : -1);
	});

	ret = makeDummyResultFromArray(ret, maxCount);

	cb(ret, lat, lng);

 };

 function makeDummyResultFromArray(ary, count){
	var ret ={};
	ret.head = {};
	ret.head.vars = [];
	ret.head.vars.push('name');
	ret.head.vars.push('lat');
	ret.head.vars.push('lng');
	for (var key in resource){
		ret.head.vars.push(key);
	}
	ret.results = {};
	ret.results.bindings = [];

	if (count == null){
		count = ary.length;
	}
	if (ary.length < count){
		count = ary.length;
	}

	for (var i=0; i<count; i++){
		var elm = {};
		elm.name = {};
		elm.name.value = ary[i].name;

		elm.lat = {};
		elm.lat.value = ary[i].lat;

		elm.lng = {};
		elm.lng.value = ary[i].lng;

		for (var key in resource){
			elm[key] = {};
			elm[key].value = ary[i][key];
		}
		ret.results.bindings.push(elm);

	}
	return ret;
 }

