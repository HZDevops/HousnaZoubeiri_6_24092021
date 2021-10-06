const express = require('express');
const router = express.Router();

//Import controllers for Sauce routes and Authentication middleware
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');

//Import multer middleware for managing images
const multer = require('../middleware/multer-config');

//Add Sauce routes with authentication security and multer for the post and put routes
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.post('/:id/like', auth, sauceCtrl.likeOrDislikeSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);

module.exports = router;
