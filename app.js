const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(
  'mongodb+srv://hzoubeiri:IrlasNahouza2016@cluster0.7e2xu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err) => {
    if (err) {
     return console.log('Connexion à MongoDB échouée !', err)
    }
    console.log('Connexion à MongoDB réussie !')
  }
);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

module.exports = app;
