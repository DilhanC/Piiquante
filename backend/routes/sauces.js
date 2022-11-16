// Import d'Express
const express = require('express');

// Déclaration des routes
const router = express.Router();

// Import du middleware d'authentification
const auth = require('../middlewares/auth');

// Import du middleware de gestion de fichiers entrants
const multer = require('../middlewares/multer');

// Import des controllers
const sauceCtrl = require('../controllers/sauces');

// Ajout des controllers aux routes (incluant le middleware d'authentification et la gestion de fichiers)
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeASauce);

module.exports = router;