const Sauce = require('../models/sauces');
const fs = require('fs');


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


exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  })
  .then((sauce) => res.status(200).json(sauce))
  .catch((error) => res.status(404).json({ error }))
}


exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? //Vérification if object create
    {
      ...JSON.parse(req.body.sauce), //Si oui, on récupère les informations au format JSON
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //Puis on génére une nouvelle URL
    } : { ...req.body } //Sinon on modifie son contenu
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }))
}


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //On trouve l'objet dans la base de données
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]; //On extrait le nom du fichier à supprimer
      fs.unlink(`images/${filename}`, () => { //On supprime ce fichier (ici l'image)
        Sauce.deleteOne({ _id: req.params.id }) //Puis on supprime l'objet de la base de données
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }))
      })
    })
    .catch(error => res.status(500).json({ error }))
}


exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }))
}


exports.likeASauce = function (req, res, next) {
  Sauce.findOne({ _id: req.params.id })
    .then(function (likedSauce) {
      switch (req.body.like) {
        // Like
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
        // Dislike
        case -1:
          if (!likedSauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
            Sauce.updateOne({ _id: req.params.id },
              { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, }
            )
              .then(() => res.status(201).json({ message: "La sauce a été dislikée !" }))
              .catch(error => res.status(400).json({ error }))
          }
          break
        // Cancel like
        case 0:
          if (likedSauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id },
              { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, }
            )
              .then(() => res.status(201).json({ message: "Le like de la sauce a été annulé !" }))
              .catch(error => res.status(400).json({ error }))
          }
          // Annulation du dislike 
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