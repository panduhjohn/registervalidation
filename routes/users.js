const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
// const { check } = require('express-validator');
const expressValidator = require('express-validator')

let User = require('../models/User');

let signupController = require('../controllers/signupController')
let userController = require('../controllers/userController')
let authChecker = require('../controllers/authChecker')

/* GET users listing. */
router.get('/', function (req, res, next) {
    userController.findAllUsers({}, (err, users) => {
        if (err) {
            res.status(400).json({
                confirmation: 'failure',
                message: err
            })
        } else {
            res.json({
                confirmation: 'Success',
                payload: users
            })
        }
    })
});


//-----------------
//Validator
router.use(expressValidator({
    errorFormatter: (param, message, value) => {
      let namespace = param.split('.');
      let root = namespace.shift();
      let formParam = root;
  
      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']'
      }
      return {
        param: formParam,
        message: message,
        value: value
      }
    }
  }))
// ----------------
//Register

router.get('/register', (req, res) => {
    console.log(`16`);
    res.render('register', { error_msg: false, success_msg: false })
})

router.post('/register',
    signupController.checkExistsEmail,
    signupController.checkExistUsername,
    signupController.createUser,

    // req.checkbody('name', 'Only a-z characters').isAlpha()

    // req.body.username.check('username').notEmpty().withMessage('Please enter a username').isLength({ min: 3, max: 15 }).withMessage('Username must be between 3 and 15 characters').blacklist(/<>\//)
)

router.get('/contact', (req, res) => {
    res.render('contact', { error_msg: false, success_msg: false })
})

const userNameChecker = (username) => {
    
    username.check('username').notEmpty().withMessage('Please enter a username').isLength({min: 3, max: 15}).withMessage('Username must be within 3 and 15 characters').blacklist(/<>\//);
  }

router.post('/contact', [
    check('req.body.name').isLength({ min: 3 }),
    check('req.body.email').isEmail(),
    check('age').isNumeric()
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
  
    const name  = req.body.name
    const email = req.body.email
    const age   = req.body.age
  })

// ----------------
//Contact
// router.get('/contact', (req, res) => {
//     res.render('contact', { error_msg: false, success_msg: false })
// })
// router.post('/contact', (req, res) => {

// })

// ----------------
//Login
router.get('/login', (req, res) => {
    res.render('login', { error_msg: false, success_msg: false })
})

router.post('/login', (req, res) => {

    // 1. find user in MongoDB using email
    User.findOne({ email: req.body.email }, (err, user) => {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                res.status(400).json({
                    confirmation: 'failure',
                    message: err

                    // success_msg: 'User logged in'
                })
            }

            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        res.status(400).json({
                            confirmation: 'failure',
                            message: 'Passwords do not match'
                        })
                    }

                    if (result) {
                        res.render('login', { success_msg: 'User Logged In', error_msg: false })
                    } else {
                        res.render('login', { success_msg: false, error_msg: 'Passwords do not match' })
                    }
                })
            }
            // res === false
        })

    })

    // 2. use bcrypt.compare to compare password from login form and user.password
    // 3.1 if passwords match render login page with success msg
    // 3.2 if passwords do not match render login page with error msg

    // res.json(req.body)
})

router.put('/updateuserbyid/:id', (req, res) => {

    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedUser) => {
        if (err) {
            res.status(400).json({
                confirmation: 'failure',
                message: err
            })
        } else {
            res.json({
                confirmation: 'Success',
                payload: updatedUser
            })
        }
    })

})

// ----------------
//About
router.get('/about', (req, res) => {
    res.render('about', { error_msg: false, success_msg: false })
})
router.post('/about', (req, res) => {

})

router.get('*', (req, res) => {
    res.send('Learn how to type')
})

module.exports = router;
