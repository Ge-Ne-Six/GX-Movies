const { functions } = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const { isStrongPassword } = require('validator');
const { isMobilePhone } = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email:{
    type: String,
    required: [true,'Please enter your email'],
    lowercase: true,
    validate: [isEmail,'Please enter a valid email!'],
    unique: [true, 'this email is already registered']
  },
  password:{
    type: String,
     required: [true,'Please enter your password'],
     validate: [isStrongPassword,'Password must contain Alphanumeric characters and a symbol!']
  },
  phonenumber:{
    type: String, 
    required: [true,'Please enter your Phone number'],
    validate: [isMobilePhone, 'Please enter a valid phone number!'],
    unique: [true, 'this phone number is already registered']
  },
  firstname:{
    type: String
  },
  lastname:{
    type: String
  },
  middlename:{
    type: String
  },
  dob:{
    type: String
  },
  imag:{
    data:Buffer,
    type: String
  },
  status:{
    type: String
  }
})



userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password,salt);

  // if(this.firstname){

  // }
  next();
});

userSchema.statics.login = async function({email, password}){
  if(email !== ''){
      const user = await this.findOne({email});

      if(user){
        if(password !== ''){
          const auth = await bcrypt.compare(password,user.password);

            if(auth){
              return user;
            }
          throw Error('incorrect password');
      }
        throw Error('please enter ur password');
    }
    throw Error('this email is registered');
  }
  throw Error('please enter your email');
}



const User = mongoose.model('user', userSchema);
module.exports = User;