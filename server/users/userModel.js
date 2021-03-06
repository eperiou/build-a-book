const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  books: { type: Array, default: [] },
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserSchema;
module.exports = UserModel;
