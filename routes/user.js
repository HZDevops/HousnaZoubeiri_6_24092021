const express = require('express');
const router = express.Router();

//Import controllers for User routes
const userCtrl = require('../controllers/user');

//Add authentication routes for User
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
