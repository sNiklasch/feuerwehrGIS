var express = require('express');
var router = express.Router();

var fahrten = require('../controllers/fahrtenController');

/* POST /fahrten */
router.post('/', fahrten.post);

// GET /fahrten
router.get('/', fahrten.get);

// GET /fahrten/fjaslfj478329fsafashf2
router.get('/:fahrtId', fahrten.show);

// PUT /fahrten/fasdfjasdkfjasökfj23343 --> body: Datenobjekt
router.put('/:fahrtId', fahrten.put);

// DELETE /fahrten/fjaslfj478329fsafashf2
router.delete('/:fahrtId', fahrten.delete);

module.exports = router;