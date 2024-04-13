const User = require('../models/user');
const Movie  = require('../models/movies');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const multer = require('multer');
const path = require('path');



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

module.exports.picUpload_post =  (req, res) =>{
  let token = req.cookies.sign;
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
               let met = await user.updateOne({ imag: req.file.originalname });
              // res.json({user});
              res.redirect('/genesix')
            }
            catch(err){
              console.log(err)
            }
            
          }
    
        })
      }else{
        res.json({
          message: 'Login Token is no longer valid!'
        })
      }
}

module.exports.movieSearch_post = async (req,res) =>{
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
}