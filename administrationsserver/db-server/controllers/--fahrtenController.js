require('../models/fahrt');
var mongoose = require('mongoose');
var _ = require('underscore');
var Fahrt = mongoose.model("Fahrt");

exports.post = function(req, res){
	var fahrt = new Fahrt(req.body);
	fahrt.save();
	res.jsonp(fahrt);
};

exports.get = function(req, res){
	Fahrt.find().exec(function(err, fahrten) {
			res.jsonp(fahrten);
		});
};

exports.show = function(req, res){
	Fahrt.load(req.params.fahrtId, function(err, fahrt){
		res.jsonp(fahrt);
	});
};

exports.put = function(req, res){
	Fahrt.load(req.params.fahrtId, function(err, fahrt){
		
		fahrt = _.extend(fahrt, req.body);

		fahrt.save(function(err){
			res.jsonp(fahrt);
		});
	});
};


exports.delete = function(req, res){
	Fahrt.load(req.params.fahrtId, function(err, fahrt){
		fahrt.remove(function(err){
			res.jsonp(fahrt);
		})
	});
};