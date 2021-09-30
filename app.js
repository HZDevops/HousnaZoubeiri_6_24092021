const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

mongoose.connect(
  `mongodb+srv://hzoubeiri:${DB_PASSWORD}@cluster0.7e2xu.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
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
