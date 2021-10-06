const ModelsSauce = require('../models/sauce');
const fs = require('fs');

function createSauce (req, res) {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new ModelsSauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce saved !' }))
    .catch((error) => res.status(400).json({ error }));
}

function modifySauce (req, res) {
  const sauceObject = req.file
    ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`
    }
    : { ...req.body };
  ModelsSauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Sauce modified !' }))
    .catch((error) => res.status(400).json({ error }));
}

function deleteSauce (req, res) {
  ModelsSauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        ModelsSauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce removed !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
}

function getOneSauce (req, res) {
  ModelsSauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
}

function getAllSauce (req, res) {
  ModelsSauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
}

function likeOrDislikeSauce (req, res) {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;

  if (like === 1) {
    ModelsSauce.updateOne(
      { _id: sauceId },
      { $push: { usersLiked: userId }, $inc: { likes: +1 } }
    )
      .then(() => res.status(200).json({ message: 'Like added!' }))
      .catch(error => res.status(400).json({ error }));
  }

  if (like === -1) {
    ModelsSauce.updateOne(
      { _id: sauceId },
      { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
    )
      .then(() => res.status(200).json({ message: 'Dislike added !' }))
      .catch(error => res.status(400).json({ error }));
  }

  // Cancel a Like or Dislike
  if (like === 0) {
    ModelsSauce.findOne({ _id: sauceId })
      .then((sauce) => {
        // Cancel a Like
        if (sauce.usersLiked.includes(userId)) {
          ModelsSauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then(() => res.status(200).json({ message: 'Like removed !' }))
            .catch(error => res.status(400).json({ error }));
        }

        //Cancel a Dislike
        if (sauce.usersDisliked.includes(userId)) {
          ModelsSauce.updateOne(
            { _id: sauceId },
            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
          )
            .then(() => res.status(200).json({ message: 'Dislike removed !' }))
            .catch(error => res.status(400).json({ error }));
        }
      })
      .catch(error => res.status(404).json({ error }));
  }
}

module.exports = {
  createSauce,
  modifySauce,
  deleteSauce,
  getOneSauce,
  getAllSauce,
  likeOrDislikeSauce
};
