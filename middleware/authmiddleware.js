const jwt = require('jsonwebtoken');
// const express = require('express');
const User = require('../models/user')

/*------------USER-MIDDLEWARE-----------------------*/
const pageAuth = (req, res, next) =>{
  
  const token = req.cookies.sign;

  if(token){
    jwt.verify( token,'Is Obi a boy?', (err, decodedtoken) =>{
      if(err){
        console.log(err);
        res.redirect('/login');
      }
      else{
        console.log(decodedtoken);
        next(); 
      }
    })
  }
  else{
    res.redirect('/login'); 
  }
};

const checkUser =  (req, res, next) =>{
  const token = req.cookies.sign;

  if(token){
    jwt.verify( token,'Is Obi a boy?', async (err, decodedtoken) =>{
      if(err){
        console.log(err.message);
        res.locals.user = null;
        next();
      }
      else{
        console.log(decodedtoken);
        let user = await User.findById(decodedtoken.id);
       if(user){
        let name =  res.locals.user = user;

        req.user = decodedtoken.id 
        // console.log(name);
       }else{
        res.redirect('/logout');
       }
      next();
      }

    })
  }
  else{
    res.locals.user = null;
    // res.redirect('/GENESIX/login');
    next();
  }
};


/*------------------forgotten-password-auth-----------*/ 
// const forgottenPass = (req, res, next) =>{
  
//   const token = req.cookies.sign;

//   if(token){
//     jwt.verify( token,'Is Obi a boy?', (err, decodedtoken) =>{
//       if(err){
//         next()
//       }
//       else{
//         res.locals.message = 'This User is already logged in';
//         res.json({
//           logMessage: 'This User is already logged in',
//         })
//         console.log('This User is already logged in')
//         res.redirect('/login') 
//       }
//     })
//   }
//   else{
//     next()
//   }
// };


/*---------------------ERROR-HANDLER---------------------*/

const handleError = (err) => {
  console.log(err.message,err.code);
  let errors = {email: '', password: '', phonenumber: ''};

  if(err.message === 'please enter your email'){
    errors.email = 'please enter your email';
  }
  if(err.message === 'incorrect email'){
    errors.email = 'incorrect email';
  }
  if(err.message === 'please enter ur password'){
    errors.password = 'please enter ur password';
  }
  if(err.message === 'incorrect password'){
    errors.password = 'incorrect password';
  }
  if(err.message === 'this email is registered'){
    errors.email === 'this email is registered';
  }

  if (err.code === 11000) {
    if(err.message.includes('email_1 dup key')){
      errors.email = 'This email is already been used';
    }
    if(err.message.includes('phonenumber_1 dup key')){
      errors.phonenumber = 'This phonenumber is already been used'
    }

    return errors;
  }

  if(err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({properties}) => {

      errors[properties.path] = properties.message;

    })

  }

  return errors;
};

const maxAge = 1 * 24 * 60 * 60;

const createToken = (id) =>{
  return jwt.sign({id}, 'Is Obi a boy?', { expiresIn: maxAge});
};


/*------------ADMIN----MIDDLEWARE---------------------------*/

const adminToken = (id) =>{
  return jwt.sign({id}, 'GeNeSix is the future', { expiresIn: maxAge});
};

const adminAuth = (req, res, next) =>{
  
  const token = req.cookies.GenesixAdmin;

  if(token){
    jwt.verify( token,'GeNeSix is the future', (err, decodedtoken) =>{
      if(err){
        console.log(err);
        res.redirect('/admin/login');
      }
      else{
        console.log(decodedtoken);
        next(); 
      }
    })
  }
  else{
    res.redirect('/admin/login'); 
  }
};

const checkAdmin =  (req, res, next) =>{
  const token = req.cookies.GenesixAdmin;

  if(token){
    jwt.verify( token,'GeNeSix is the future', async (err, decodedtoken) =>{
      if(err){
        console.log(err.message);
        next();
      }
      else{
        console.log(decodedtoken);
        let user = await User.findById(decodedtoken.id);
       if(user){
        let name =  res.locals.user = user;

        req.user = decodedtoken.id 
       }else{
        res.redirect('/admin/logout');
       }
      next();
      }

    })
  }
  else{
    res.locals.user = null;
    // res.redirect('/GENESIX/login');
    next();
  }
};



module.exports = { pageAuth , checkUser, handleError, createToken, adminToken, adminAuth, checkAdmin } 