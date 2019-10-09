const User = require('../models/User')

const authChecker = (req, res, next) => {
    userNameChecker(req);
    emailChecker(req);
    passwordChecker(req);
  
    next()
  }
  
  const userNameChecker = (username) => {
    username.check('username').notEmpty().withMessage('Please enter a username').isLength({min: 3, max: 15}).withMessage('Username must be within 3 and 15 characters').blacklist(/<>\//);
  }
  
  const emailChecker = (email) => {
    email.check('email').isEmail().withMessage('Please enter valid email');
  }
  
  const passwordChecker = (password) => {
    password.check('password').notEmpty().withMessage('Password cannot be empty');
  
    password.check('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d`~!@#$%^&*()_+]{5,10}$/).withMessage('Minimum 5 and Maximum 10 characters, at least one uppercase, lowercase letter, one number, and one special character');
    
    password.check('password2').notEmpty().withMessage('Confirm password cannot be empty').equals(password.body.password).withMessage('Passwords must match!')
  }
  
  module.exports = authChecker;
  