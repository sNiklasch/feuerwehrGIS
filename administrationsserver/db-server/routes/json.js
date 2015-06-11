//Express-Controller, um Daten in die Datenbank zu speichern:
var express = require('express');
var router = express.Router();

var json = require('../controllers/jsonController')

// POST /layers/WMS
router.post('/', json.post);

module.exports = router;