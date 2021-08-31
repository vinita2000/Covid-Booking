var express = require('express');
var router = express.Router();
const {nearbyLabs} = require('../controllers/lab/nearbyLabs');
const {getLab} = require('../controllers/lab/getLab');
const {bookSlot} = require('../controllers/lab/booking');

router.get('/nearbyLabs', nearbyLabs);
router.get('/getLab', getLab);
router.put('/bookSlot', bookSlot);

module.exports = router;
