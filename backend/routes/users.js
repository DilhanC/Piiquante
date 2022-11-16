const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/users');

// Mise en place Inscription et login
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;