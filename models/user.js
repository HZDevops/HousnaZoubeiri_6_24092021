const mongoose = require('mongoose');

//Import package for user data validation before saving them
const uniqueValidator = require('mongoose-unique-validator');

//Define a schema for a User: an unique email adress per user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
