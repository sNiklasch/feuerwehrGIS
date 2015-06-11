//db-schema und -model für die eingetragenen Geo-Datensätze
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LayerSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: String,
	url: String,
	type: String,
	lastUpdate: Date,
	autoUpdate: {
		type: Boolean,
		default: false
	},
	info: Object
});

//Funktionen für die datenbank:
LayerSchema.statics = {
	load: function(id, callback){
		this.findOne({_id: id}).exec(callback);
	}
};

mongoose.model('Layer', LayerSchema);