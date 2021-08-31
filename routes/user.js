var express = require('express');
var router = express.Router();
const {register} = require('../controllers/public/register');
const {login} = require('../controllers/public/login');
const {getProfile} = require('../controllers/profile');

router.post('/register', register);
router.post('/login', login);
router.get('/getProfile', getProfile);

module.exports = router;
