const mongoose = require('mongoose');

const Schema = mongoose.Schema

const newMovies = new Schema({
  title:{
    type: String
  },
  filePath:{
    type: String
  },
  description:{
    type: String
  },
  language:{
    type: String
  },
  quality:{
    type: String
  },
  year:{
    type: String
  },
  image:{
    type: String
  },
  type:{
    type: String
  },
  genre:{
    type: String
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
});

const Movies = mongoose.model('movie', newMovies);

module.exports = Movies; 