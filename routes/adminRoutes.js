const express = require('express');
const User = require('../models/user');
const path = require('path');
const  jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const { handleError, adminAuth, adminToken, checkAdmin } = require('../middleware/authmiddleware');
const Movie  = require('../models/movies');
const multer = require('multer');

const router = express.Router();

router.get('*', checkAdmin );


//movieUpload
const movieStorage = multer.diskStorage({
  destination: './public/Movies/',
  filename: function(req, file, cb){
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  }
});

//initialize upload variable
const upload = multer({ storage: movieStorage });



const maxAge = 1 * 24 * 60 * 60;

router.get('/login', async (req, res)=>{
 
  res.render('adminLogin')
  
}); 

router.get('/', adminAuth, async (req, res)=>{
 
  try{
    let user = await User.find();
    res.render('admindash', {User : user});

  }
  catch(err){
    console.log(err.message);  
  }
  
});

router.get('/movies-upload',  (req, res)=>{
  res.render('movie-upload')  
});

router.get('/logout',  (req, res)=>{
  res.cookie('GenesixAdmin', '', {maxAge: 1});
  res.redirect('/admin/login')
});

router.get('/user/:id', adminAuth, (req, res)=>{

  const id = req.params.id;
 
  User.findById(id)  
  .then(result => {
    res.render('usersdetails', {user : result})

    res.send(result);
  })
  .catch(err =>{
    console.log(err.message);
  })
  
});

router.delete('/:id', adminAuth, (req,res) =>{
  const id = req.params.id;

  User.findByIdAndDelete(id)
  .then(result => {
    res.json({ redirect : '/admin' })
  })
  .catch(err =>{
    console.log(err.message)
  })
 
});

router.post('/adminStatus/:id', adminAuth, async (req,res) =>{
  const id = req.params.id;

  let { status } = req.body;

  let user = await User.findById(id);

  try{

    let Status = await user.updateOne({ status })


    res.json({ redirect : '/admin' })

 }
  catch(err){
    console.log(err.message); 
  } 
 
 
});

router.post('/login', async (req, res)=>{
 
  const { email, password } = req.body;

  try{
    const admin = await User.login({email, password});

    if(admin.status == 'ADMIN'){

      console.log(admin.status);

      const adminT = adminToken(admin._id);
      res.cookie('GenesixAdmin', adminT, {httpOnly: true, maxAge: maxAge * 1000});
      res.status(400).json({ admin: admin._id})
    }else{

      res.json({adminError: 'u are not an admin so piss off'});

    }

    // res.cookie('sign', token, {httpOnly: true, maxAge: maxAge * 1000});
    
  }
  catch(err){
    console.log(err);
    let errors = handleError(err);
    res.status(400).json({errors});
  }
});


router.post('/movies-upload', upload.fields([{ name: 'newMovie' }, { name: 'image' }]), async (req, res) => {
  try {
    const { newMovie, image } = req.files;
    const { title, description, language, quality, year, genre, type } = req.body;


    const newMovieEntry = new Movie({
      title,
      image: image,
      description,
      language,
      quality,
      year,
      genre,
      type,
      filePath: newMovie
    });

    const checkMovie = await Movie.findOne({ title });

    if (!checkMovie) {
      await newMovieEntry.save();
      res.redirect('/admin');
    } else {
      res.status(400).json({ message: 'This movie already exists!' });
    }
  } catch (error) {
    console.error('Error saving movie and image:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router; 