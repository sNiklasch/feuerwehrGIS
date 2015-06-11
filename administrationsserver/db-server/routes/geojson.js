//Express-Controller, um Daten in die Datenbank zu speichern:
var express = require('express');
var router = express.Router();

var geojson = require('../controllers/geojsonController')

// POST 
router.post('/', geojson.post);

// POST 
router.post('/csv', geojson.convertCsv);

// GET /geojson
router.get('/', geojson.get);

// GET /geojson/saskdhjb3243245234234
router.get('/:layerId', geojson.show);

module.exports = router;