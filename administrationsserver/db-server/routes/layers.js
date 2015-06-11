//Express-Controller, um Daten in die Datenbank zu speichern:
var express = require('express');
var router = express.Router();

var layers = require('../controllers/layersController')

// POST /layers
router.post('/', layers.post);

// GET /layers
router.get('/', layers.get);

// GET /layers/saskdhjb3243245234234
router.get('/:layerId', layers.show);

// PUT /layers/saskdhjb3243245234234
router.put('/:layerId', layers.put);

// DELETE /layers/saskdhjb3243245234234
router.delete('/:layerId', layers.delete);

module.exports = router;