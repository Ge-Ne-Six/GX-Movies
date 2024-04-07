const User = require('../models/user');
const Movie  = require('../models/movies');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const multer = require('multer');
const path = require('path');


//imageStorage
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

//initialize upload variable
const uploads = multer({ 
  storage: storage 
}).single('profileImage'); 



module.exports.home_get = (req, res) =>{

  Movie.find()
  .then(result =>{
    res.render('home',{movies: result});
  })
  .catch(err =>{
    console.log(err); 
  });

}

module.exports.movie_get = (req, res)=>{
  
  Movie.find()
  .then(result =>{
    res.render('movies',{movies: result});
  })
  .catch(err =>{
    console.log(err);
  });

}

module.exports.animation_get = (req, res)=>{

  Movie.find()
  .then(result =>{
    res.render('animation',{movies: result});
  })
  .catch(err =>{
    console.log(err);
  });
  // res.render('animation')
}

module.exports.series_get = (req, res)=>{

  Movie.find()
  .then(result =>{
    res.render('series',{movies: result});
  })
  .catch(err =>{ 
    console.log(err);
  });
  // res.render('series') 
} 

module.exports.picUpload_get = (req, res) =>{
  res.render('pic-upload');
}

module.exports.profileUpdate_get = (req, res) =>{
  res.render('profile-Update');
}

module.exports.id = (req,res) =>{
  const id = req.params.id;
  Movie.findById(id)
  .then(result =>{
    res.render('movie-page', { movie: result });
  })
 
}

module.exports.profileUpdate_post = async (req, res) =>{
  // res.render('profile');
  let {firstname, lastname, middlename, dob} = req.body;

  const token = req.cookies.signin;

  if(token){
    jwt.verify( token,'Is Obi a boy?',async (err, decodedtoken) =>{
      if(err){
        console.log(err.message);
        res.redirect('/login')

        
      }
      else{
        console.log(decodedtoken);
        let user = await User.findById(decodedtoken.id);

        try{       
           let met = await user.updateOne({firstname, lastname, middlename, dob});
          res.json({user});
        }
        catch(err){
          console.log(err)
        }
        
      }

    })
  }
  else{
    res.locals.user = null;
    res.redirect('/login');
  } 

}

module.exports.picUpload_post = (req, res) =>{
  uploads(req, res, (err) => {
    if(err){
      console.log(err);
      res.send(err);
    }
    else{
      console.log(req.file);
      res.redirect('/genesix');

      const token = req.cookies.signin;

      if(token){ 
        jwt.verify( token,'Is Obi a boy?',async (err, decodedtoken) =>{
          if(err){
            console.log(err.message);
            res.redirect('/login')
    
            
          }
          else{
            console.log(decodedtoken);
            let user = await User.findById(decodedtoken.id);
    
            try{       
               let met = await user.updateOne({ imag: req.file.filename});
              res.json({user});
            }
            catch(err){
              console.log(err)
            }
            
          }
    
        })
      }
    }
  })
}

