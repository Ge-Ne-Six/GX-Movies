const express = require('express');
const otherPage = require('../controllers/otherPageController');
const { pageAuth, checkUser } = require('../middleware/authmiddleware');
const path = require('path');
const multer = require('multer');
const Movie = require('../models/movies')

const router = express.Router();

router.get('*', checkUser);

  

router.get('/', pageAuth, otherPage.home_get);

router.get('/movie', pageAuth, otherPage.movie_get);

router.get('/animation', pageAuth, otherPage.animation_get);

router.get('/series', pageAuth, otherPage.series_get);

router.get('/profile-Update', pageAuth, otherPage.profileUpdate_get);

router.get('/pic-upload', pageAuth, otherPage.picUpload_get);

router.get('/:id', pageAuth, otherPage.id); 

router.post('/profile-Update', pageAuth, otherPage.profileUpdate_post);

router.post('/pic-upload', pageAuth, otherPage.picUpload_post);

router.post('/movie-search', async (req,res) =>{
  let nameUp = req.body;
  let all = [];
  
  let name = nameUp.nameUp;


  try{
    let result = await Movie.find();

  
    
    for(i = 0; i < result.length; i++){
      let single = result[i];

      if(single.title.toUpperCase().includes(name) && name !== ''){
        all.push(single);
        
      }

    }

    res.json({all});

  }
  catch(err){
    console.log(err.message)
  }
})


module.exports = router;