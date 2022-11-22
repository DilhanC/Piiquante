const express = require('express')

const router = express.Router()

const auth = require('../middlewares/auth')

const multer = require('../middlewares/multer')

const sauceCtrl = require('../controllers/sauces')

router.get('/', auth, sauceCtrl.getAllSauces)
router.post('/', auth, multer, sauceCtrl.createSauce)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)
router.post('/:id/like', auth, sauceCtrl.likeASauce)

module.exports = router