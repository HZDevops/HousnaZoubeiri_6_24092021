const ModelsSauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');

function createSauce(req, res, next) {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new ModelsSauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch((error) => res.status(400).json({ error }));
}

function modifySauce(req, res, next) {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  ModelsSauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch((error) => res.status(400).json({ error }));
}

function deleteSauce(req, res, next) {
  ModelsSauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        ModelsSauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
}

function getOneSauce(req, res, next) {
  ModelsSauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
}

function getAllSauce(req, res, next) {
  ModelsSauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
}

function likeStatus(req, res, next) {
  console.log(req.body);
  const likeNumber = req.body.like;
  //if(likeNumber==1){
  ModelsSauce.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: 1 } })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
}

module.exports = {
  createSauce,
  modifySauce,
  deleteSauce,
  getOneSauce,
  getAllSauce,
  likeStatus,
};
