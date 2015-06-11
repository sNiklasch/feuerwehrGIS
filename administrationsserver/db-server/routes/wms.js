//Express-Controller, um Daten in die Datenbank zu speichern:
var express = require('express');
var router = express.Router();

var wms = require('../controllers/wmsController')

// POST /WMS
router.post('/', wms.post);

// GET /WMS/saskdhjb3243245234234
router.get('/:layerId', wms.getCap);


module.exports = router;