var http = require('http')
  , fs = require('fs')
  , mkdirp = require('mkdirp');
var mongoose = require('mongoose');
var Layer = mongoose.model('Layer');
var validator = require('validator');
var parser = require('xml2json');

var res;
var completeArray = new Array();
var options;
/*
Aufbau des options-Objekt nach http-POST:
{
	"name": "elwas",
	"url": "http://www.wms.nrw.de/wms/elwas?",
	"bbox": {"xmin":7.5967, "xmax":7.6465, "ymin":51.9418, "ymax":51.9708},
	"zoom": {
		"min": 12,
		"max": 14
	},
	"layer": "Kartenwerke",
	"EPSG": 4326
}

*/

exports.post = function(request, response){
	res = response;
	options = request.body;
	clearCompleteArray();
	console.log(options);
	console.log("download wms");
	downloadWMS(options.url, options.name);
	//response.jsonp("complete");
	//TODO: add callback for response
};


exports.getCap = function(request, response){
	console.log(request.params.layerId);
	Layer.load(request.params.layerId, function(err, layer){
		console.log(layer);
		getCapabilities(layer.url, function(capabilities){
			response.jsonp(capabilities);
		});
	});
};



function getCapabilities(url, callback){
	//prüfe, ob es sich um eine valide URL handelt:
	if(validator.isURL(url, ['http'])){
		console.log("valid url");
		var wmsUrl = url.split("?")[0];
		wmsUrl = wmsUrl + "?SERVICE=WMS";
		
		var capabilities = "";
		console.log(url);
		
		httpCallback = function(response) {
		  var str = '';

		  //another chunk of data has been recieved, so append it to `capabilities`
		  response.on('data', function (chunk) {
		    capabilities += chunk;
		  });

		  //the whole response has been recieved, so we just print it out here
		  response.on('end', function () {
		    var jsonCap = "";
		    //versuche die Antwort als JSON zu parsen:
		    try {
		    	jsonCap = JSON.parse(parser.toJson(capabilities))
		    } catch(e){// wenn es nicht geparst werden konnte, kamen keine validen capabilities als antwort
				jsonCap = "";
				console.log("no capabilities");
			}
			if (!jsonCap.hasOwnProperty("WMS_Capabilities")) {
				console.log("no capabilities field");
				jsonCap = "";
			}
	    	callback(jsonCap);
		  });
		}
		http.request(wmsUrl + "&REQUEST=GetCapabilities", httpCallback).end();
	} //wenn es keine Valide URL ist, gibt es keine capabilities:
	else {
		callback("");
	}
}







//give the response when all zoom-levels have been downloaded
function setResponse(zoom){
	completeArray[zoom] = true;
	for (var i = options.zoom.min; i <= options.zoom.max; i++) {
		if (!completeArray[i]) {
			return;
		};
	};
	res.jsonp("complete");
}

function downloadWMS(url, name){
	
	//build the tile-url:
	var wmsUrl = url.split("?")[0];
	wmsUrl = wmsUrl + "?SERVICE=WMS";
	wmsUrl = wmsUrl + "&VERSION=1.1.1";
	wmsUrl = wmsUrl + "&REQUEST=GetMap";
	wmsUrl = wmsUrl + "&FORMAT=image/png";
	wmsUrl = wmsUrl + "&WIDTH=256&HEIGHT=256";
	wmsUrl = wmsUrl + "&SRS=EPSG:" + options.EPSG;
	wmsUrl = wmsUrl + "&LAYERS=" + options.layer;

	mkdirp('layers/' + name, function(err){});

	for (var currentZoom = options.zoom.min; currentZoom <= options.zoom.max; currentZoom++) {
		var n = Math.pow(2, currentZoom); //the number of tiles at the current zoom level
		console.log("zoom: " + currentZoom);
		console.log("tiles: " + n);

		downloaderCallback(wmsUrl, name, currentZoom, xtilemin(currentZoom), ytilemin(currentZoom));

	};
}

function downloaderCallback(url, name, zoom, currentX, currentY){
	if (currentX == xtilemax(zoom) && currentY == ytilemax(zoom)) {
		setResponse(zoom);
	} else if (currentY == ytilemax(zoom)){
		downloadTile(url, name, zoom, currentX + 1, ytilemin(zoom));
	} else {
		downloadTile(url, name, zoom, currentX, currentY + 1);
	}
}

function downloadTile(url, name, zoom, x, y){
	var path = 'layers/' + name + '/' + zoom + '/' + x;
	var filename = y + '.png';

	var xmin = xTileToCoord(x, zoom);
	var xmax = xTileToCoord((x + 1), zoom);
	var ymin = yTileToCoord((y + 1), zoom);
	var ymax = yTileToCoord(y, zoom);

	console.log("(" + x + "," + y + "): " + xmin + " / " + xmax + " / " + ymin + " / " + ymax);

	tileUrl = url + '&BBOX=' + xmin + ',' + ymin + ',' + xmax + ',' + ymax;
	//console.log(tileUrl);
	downloadImage(tileUrl, path, filename, function(){
			downloaderCallback(url, name, zoom, x, y);
		});
}

/**
 * This function downloads an image from a given url 'fromUrl'
 * to a given path 'toPath' as 'filename'
 */
function downloadImage(fromUrl, toPath, filename, callback){

	http.get(fromUrl, function(res){
	    var imagedata = ''
	    res.setEncoding('binary')

	    res.on('data', function(chunk){
	        imagedata += chunk
	    })

	    res.on('end', function(){
	    	mkdirp(toPath, function(err){
		        fs.writeFile(toPath + '/' + filename, imagedata, 'binary', function(err){
		            if (err) throw err
		            console.log('File ' + filename + ' saved.')
		        	callback();
		        })
	    	})
	    })

	})
}
//functions for coordinate/tile-conversion:
function xCoordToTile(xCoord, zoom){
	return Math.floor(((xCoord + 180) / 360) * Math.pow(2, zoom));
}

function xTileToCoord(xTile, zoom){
	n = Math.pow(2, zoom);
	return xTile / n * 360.0 - 180.0;
}

function yCoordToTile(yCoord, zoom){
	return Math.floor((1 - Math.log(Math.tan(deg2rad(yCoord)) + 1 / Math.cos(deg2rad(yCoord))) / Math.PI) / 2 * Math.pow(2, zoom));
}

function yTileToCoord(yTile, zoom){
	n = Math.pow(2, zoom);
	return rad2deg(Math.atan(sinh(Math.PI * (1 - 2 * (yTile) / n))));
}

//functions for tile-bounding-box
function xtilemin(zoom){
	return xCoordToTile(options.bbox.xmin, zoom) - 1;
}

function ytilemax(zoom){
	return yCoordToTile(options.bbox.ymin, zoom) + 1;
}

function xtilemax(zoom){
	return xCoordToTile(options.bbox.xmax, zoom) + 1;
}

function ytilemin(zoom){
	return yCoordToTile(options.bbox.ymax, zoom) - 1;
}

//math-functions:
function deg2rad(x){
	return x * Math.PI / 180;
}

function rad2deg(x){
	return x * 180 / Math.PI;
}

function sinh(x) {
  return (Math.exp(x) - Math.exp(-x)) / 2;
}

function clearCompleteArray(){
	for (var i = 0; i <= options.zoom.max; i++) {
		completeArray[i] = false;
	};
}