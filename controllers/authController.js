const jwt = require('jsonwebtoken');
const cookies = require('cookie-parser');
const User = require('../models/user');
const { handleError, createToken } = require('../middleware/authmiddleware');

const maxAge = 1 * 24 * 60 * 60;

module.exports.signup_get = (req,res) => {
  res.status(200).render('signup');
};

module.exports.login_get = (req,res) => {
  res.status(200).render('login'); 
};


module.exports.login_post = async (req,res) => {
  const {email, password} = req.body;

  try{
    const user = await User.login({email, password});
    const token = createToken(user._id);
    res.cookie('sign', token, {httpOnly: true, maxAge: maxAge * 1000});
    res.status(400).json({user: user._id});
  }
  catch(err){
    let errors = handleError(err);
    res.status(400).json({errors});
  }
}; 

module.exports.signup_post = async (req,res) => {
  const {email, password, phonenumber} = req.body;
  try{
    const user = await User.create({email, password, phonenumber});
    res.json({user: user._id});
  }
  catch(err){
    const errors = handleError(err);
    res.status(400).json({errors}); 
  }
};


module.exports.logout_get = (req, res) =>{
 res.cookie('signin', '' , { maxAge: 1 });
 res.redirect('/login');
}