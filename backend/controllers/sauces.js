const Sauce = require('../models/sauces')
const fs = require('fs')

// Create
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }))
}

// Read one
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  })
  .then((sauce) => res.status(200).json(sauce))
  .catch((error) => res.status(404).json({ error }))
}

// Update
exports.modifySauce = (req, res, next) => {
	// Get parameters & data
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message: "Vous n'êtes pas le propriétaire de cette sauce"})
      } else {
        // If file
        const sauceObject = req.file ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body } // If no file
          delete sauceObject.userId
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => {
              // Deleting file if needed
              if(req.file) {
                fs.unlink(`images/${sauce.imageUrl.split("/images/")[1]}`, () => {});
              }
              res.status(200).json({ message: 'Sauce modifiée !'});
            })
            .catch(error => res.status(400).json({ error }))
        }
    })
    .catch(error => res.status(401).json({ error }))
}

// Delete
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
    	if(sauce.userId !== req.auth.userId) {
    		res.status(403).json({ message: "Vous n'êtes pas le propriétaire de la sauce" })
    	}
    	else {
	      const filename = sauce.imageUrl.split('/images/')[1]
	      fs.unlink(`images/${filename}`, () => {
	        Sauce.deleteOne({ _id: req.params.id })
	          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
	          .catch(error => res.status(400).json({ error }))
	      })
    	}
    })
    .catch(error => res.status(500).json({ error }))
}

// Read all
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }))
}

// Like & Dislike
exports.likeASauce = function (req, res, next) {
  Sauce.findOne({ _id: req.params.id })
    .then(function (likedSauce) {
      switch (req.body.like) {
        case 1:
          if (!likedSauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
            Sauce.updateOne({ _id: req.params.id },
              {
                $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }
              })
              .then(() => res.status(201).json({ message: "La sauce a été likée !" }))
              .catch(error => res.status(400).json({ error }))
          }
          break;
        case -1:
          if (!likedSauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
            Sauce.updateOne({ _id: req.params.id },
              { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, }
            )
              .then(() => res.status(201).json({ message: "La sauce a été dislikée !" }))
              .catch(error => res.status(400).json({ error }))
          }
          break
        case 0:
          if (likedSauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id },
              { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, }
            )
              .then(() => res.status(201).json({ message: "Le like de la sauce a été annulé !" }))
              .catch(error => res.status(400).json({ error }))
          }
          if (likedSauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }}
              )
              .then(() => res.status(201).json({ message: "Le dislike de la sauce a été annulé !" }))
              .catch(error => res.status(400).json({ error }))
          }
          break
      }
    })
    .catch(error => res.status(404).json({ error }))
  }