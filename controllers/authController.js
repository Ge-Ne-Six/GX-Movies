const jwt = require('jsonwebtoken');
const cookies = require('cookie-parser');
const User = require('../models/user');
const { handleError, createToken } = require('../middleware/authmiddleware');
const passReset = require('../models/passwordRecovery');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');

const maxAge = 1 * 24 * 60 * 60;
const otpmaxAge = 3 * 60;


async function main(otp,email){
  // let otp = '123456';
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, 
    secure: true, 
    auth: {
      user: 'the.sixers.com@gmail.com',
      pass: 'xuzy urzr lxki yigm'
    }
  });

  const info = await transporter.sendMail({
    from: 'GX-movies <the.sixers.com@gmail.com>',
    to: email,
    subject: 'Your Otp',
    html: `
    <div class="wrapper" style="width: 100%; text-align: center;">
    <h2>Password Recovery OTP code </h2>
      <h1 style="color: red; letter-spacing: 10px;"> ${otp} </h1>
  </div>
    `
  })

  console.log('message sent:' + info.messageId)

}

function generateOTP() {
  const min = 100000; // Minimum 6-digit number (inclusive)
  const max = 999999; // Maximum 6-digit number (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



function passResetToken(otp){
return jwt.sign({otp}, 'pablos doings', {expiresIn: maxAge})
}

function gxAuth(user_id){
  return jwt.sign({user_id}, 'iam a baller', {expiresIn: maxAge})
  }

module.exports.signup_get = (req,res) => {
  res.status(200).render('signup');
};

module.exports.login_get = (req,res) => {
  res.status(200).render('login'); 
};

module.exports.passRecovery_get = (req,res) => {
  res.status(200).render('passrecovery'); 
};

module.exports.newPassword_get = (req,res) => {

  res.status(200).render('newpassword');

};


module.exports.login_post = async (req,res) => {
  const {email, password} = req.body;

  try{
    const user = await User.login({email, password});
    const token = createToken(user._id);
    res.cookie('sign', token, {httpOnly: true, maxAge: maxAge * 1000});
    res.status(200).json({user: user._id});
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

module.exports.passRecovery_post = async (req,res) => {
  const {email} = req.body;
  let otp = generateOTP().toString();

  try{
    let user = await User.findOne({email});
    let user_id = user.id;
    
    if(user){
      let resetModel = await passReset.create({email, otp});
      console.log(resetModel);
      let token =  passResetToken(resetModel._id);
      let authToken = gxAuth(user_id);

      if(resetModel){
        if(token){
          main(otp,email)
          .then(result => {
            res.cookie('Gxauth', authToken, {httpOnly: true, maxAge: maxAge * 1000});
            res.cookie('GenesixOtp', token, {httpOnly: true, maxAge: otpmaxAge * 1000});
            res.status(200).json({otp: 'otp has been sent to Your email'});
          })
          .catch(err => {
            console.log(err.message)
          });
          
          
        }
      }
    } else{
      res.json({message: 'this email is not registered'})
    }
  }
  catch(err){
    // const errors = handleError(err);
    res.status(400).json({err: err.message}); 
  }
};

module.exports.confirmOtp_post = async (req,res) => {
  const {otp} = req.body;
  const token = req.cookies.GenesixOtp;

  if(token){
    jwt.verify(token, 'pablos doings', async (err, otpToken) => {

      if(err){
        console.log(err);
        res.json({err: err.message})
      }
      else{

        try{
          let user = await passReset.find({otp});
          if(user){
            res.cookie('GenesixOtp', token, {httpOnly: true, maxAge: maxAge * 1000});
            res.json({result: 'otp confirmed'});
            
          }
        }
        catch(err){
          // const errors = handleError(err);
          res.status(400).json({err: err.message}); 
        }

      }

    })
  } 
  else{
    res.json({err: 'otp has expired request for another'});
  }

  
};

module.exports.newPassword_post = async (req,res) => {
  let otpToken =  req.cookies.GenesixOtp;
  let { password } = req.body;

  if(otpToken){
    jwt.verify(otpToken, 'pablos doings', async (err, verifiedToken) => {

      if(err){
        console.log(err.message)
      }
      else{
        // console.log(password);
        console.log(verifiedToken);
        let _id = verifiedToken.otp;
        let model = await passReset.findOne({_id})
        console.log(model);
        if(model){

          let email = model.email;

          let user = await User.findOne({email});

          if(user){

            const salt = await bcrypt.genSalt();
            let hashedPass = await bcrypt.hash(password,salt);

            try{
                  let updatePass = await user.updateOne({password: hashedPass});

                if(updatePass){
                  await passReset.findByIdAndDelete({_id})
                  res.cookie('GenesixOtp', '', { maxAge: 1 });
                  res.json({message: 'Password Succesfully Changed'});
              }

            }
            catch(err){
              const errors = err.message;
              // res.status(400).json({errors}); 
              console.log(errors);
            }

          }else{
            console.log('user not found')
            res.json({err: 'user not found'})
          }

        }else{
          console.log('otp not valid')
          res.json({err: 'otp is not valid'});
        }
      }

    })
  }


}

module.exports.resendOtp_post = async (req,res) => {
  const token = req.cookies.Gxauth;
  let otp = generateOTP().toString();

  if(token){
    jwt.verify(token, 'pablos doings', async (err, authToken) => {

      if(err){
        console.log(err);
        res.json({err: err.message})
      }
      else{

        try{
          let id = authToken.user_id;
          let user = await User.findById({id})
          if(user){
            let email = user.email;

            main(otp,email)
            .then(result => {

              res.json({message: 'otp has been sent to your Email'});

            })
            .catch(err =>{
              console.log(err.message)
            })

          }
        }
        catch(err){
          // const errors = handleError(err);
          res.status(400).json({err: err.message}); 
        }

      }

    })
  } 
  else{
    res.json({err: 'otp has expired request for another'});
  }

  
};

module.exports.logout_get = (req, res) =>{
 res.cookie('sign', '' , { maxAge: 1 });
 res.redirect('/login');
}