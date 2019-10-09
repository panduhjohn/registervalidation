const mongoose = require('mongoose');
const moment = require('moment');
const expressValidator = require('express-validator')
const authChecker = require('./utils/authChecker')


let UserSchema = new mongoose.Schema({
  first_name: { type: String, default: ''},
  last_name: { type: String, default: ''},
  username: { type: String, default: ''},
  email: { type: String, default: ''},
  password: { type: String, default: ''},
  timestamp: { type: String, default: () => moment().format('dddd, MMMM Do YYYY, h:mm:ss a') },
})

module.exports = mongoose.model('user', UserSchema)