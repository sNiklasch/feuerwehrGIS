/*Hier werden Funktionen definiert, die später zur Interaktion 
* mit der Datenbank über die route "layers.js" aufgerufen werden

require('../db-models/layer');
var http = require('http');
var validator = require('validator');
var parser = require('xml2json');
var mongoose = require('mongoose');
var _ = require('underscore');
var Layer = mongoose.model('Layer');

exports.post = function(request, response){
	var layer = new Layer(request.body);
	//callback, um die info einzutragen und im Anschluss 
	//alles in die Datenbank zu speichern:
	var callback = function(info){
			layer.info = info;
			layer.save();
			response.jsonp(layer);
		};
	if(layer.type == "WMS"){
		getCapabilities(layer.url, callback);
	}
	else {
		callback("");
	}
};

exports.get = function(request, response){
	Layer.find().exec(function(err, layers){
		response.jsonp(layers);
	});
};

exports.show = function(request, response){
	Layer.load(request.params.layerId, function(err, layer){
		response.jsonp(layer);
	});
};

exports.put = function(request, response){
	Layer.load(request.params.layerId, function(err, layer){

		layer = _.extend(layer, request.body);

		layer.save(function(err){
			response.jsonp(layer);
		});
	});
};

exports.delete = function(request, response){
	Layer.load(request.params.layerId, function(err, layer){
		layer.remove(function(err){
			response.jsonp(layer);
		});
	});
};
*/