require('../db-models/geojson');
var GJV = require("geojson-validation");
var csv2geojson = require('csv2geojson');
//var validator = require('validator');
//var parser = require('xml2json');
var mongoose = require('mongoose');
//var _ = require('underscore');
var GeoJSON = mongoose.model('GeoJSON');

exports.post = function(request, response){
	var features = request.body;
	if (GJV.valid(features)){
		var layer = new GeoJSON(request.body);
		layer.save();
		response.jsonp(layer);
	} else {
		response.jsonp(false);
	}
};

exports.convertCsv = function(request, response){
	/*give the options in the following schema:
	{
		content: "x;y;z ..."
		lat: "lat-field"
		lon: "lon-field"
		delimiter: ...
		crs: ...
	}*/
	var _options = request.body;

	var geoJson = csv2geojson.csv2geojson(_options.content, {
		latfield: _options.lat,
	    lonfield: _options.lon,
	    delimiter: _options.delimiter
	}, function(err, data) {
	    console.log(err);
	    console.log(data);
	    // data is the data.
	    if (GJV.valid(data)){
			var layer = new GeoJSON(data);
			layer.save();
			response.jsonp(layer);
		} else {
			response.jsonp(false);
		}
	});
};

exports.get = function(request, response){
	GeoJSON.find().exec(function(err, layer){
		response.jsonp(layer);
	});
};

exports.show = function(request, response){
	console.log(request.params.layerId);
	GeoJSON.load(request.params.layerId, function(err, layer){
		console.log(err);
		console.log(layer);
		response.jsonp(layer);
	});
};

/*
exports.get = function(request, response){
	GeoJSON.find().exec(function(err, layers){
		response.jsonp(layers);
	});
};

exports.show = function(request, response){
	GeoJSON.load(request.params.layerId, function(err, layer){
		response.jsonp(layer);
	});
};

exports.put = function(request, response){
	GeoJSON.load(request.params.layerId, function(err, layer){

		layer = _.extend(layer, request.body);

		layer.save(function(err){
			response.jsonp(layer);
		});
	});
};

exports.delete = function(request, response){
	GeoJSON.load(request.params.layerId, function(err, layer){
		layer.remove(function(err){
			response.jsonp(layer);
		});
	});
};
*/