const mongoose = require('mongoose');

const Schema = mongoose.Schema

const newPassword = new Schema({
  email:{
    type: String
  },
  otp:{
    type: String
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
});

const passReset = mongoose.model('resetpassword', newPassword);

module.exports = passReset; 