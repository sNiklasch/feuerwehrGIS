//var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var geojsonSchema = new Schema({
    //geoFeature:GeoJSON.Feature
    type: String,
    features: Schema.Types.Mixed
});

mongoose.model('GeoJSON', geojsonSchema);