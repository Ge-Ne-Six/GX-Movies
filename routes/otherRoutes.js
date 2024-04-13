const express = require('express');
const otherPage = require('../controllers/otherPageController');
const { pageAuth, checkUser } = require('../middleware/authmiddleware');
const path = require('path');
const multer = require('multer');
const Movie = require('../models/movies')

const router = express.Router();

router.get('*', checkUser);


//imageStorage
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  }
});

//initialize upload variable
const uploads = multer({ 
  storage: storage 
})

  

router.get('/', pageAuth, otherPage.home_get);

router.get('/movie', pageAuth, otherPage.movie_get);

router.get('/animation', pageAuth, otherPage.animation_get);

router.get('/series', pageAuth, otherPage.series_get); 

router.get('/profile-Update', pageAuth, otherPage.profileUpdate_get);

router.get('/pic-upload', pageAuth, otherPage.picUpload_get);

router.post('/pic-upload', uploads.single('profileImage'), otherPage.picUpload_post);

router.get('/:id', pageAuth, otherPage.id); 

router.post('/profile-Update', pageAuth, otherPage.profileUpdate_post);



router.post('/movie-search', otherPage.movieSearch_post);


module.exports = router;