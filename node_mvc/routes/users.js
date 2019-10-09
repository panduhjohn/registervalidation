const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

let User = require('../models/User');

let signupController = require('../controllers/signupController')
let userController = require('../controllers/userController')


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

// ----------------
//Register

router.get('/register', (req, res) => {
    console.log(`16`);
    res.render('register', { error_msg: false, success_msg: false })
})

router.post('/register',
    signupController.checkExistsEmail,
    signupController.checkExistUsername,
    signupController.createUser
)

// ----------------
//Contact
router.get('/contact', (req, res) => {
    res.render('contact', { error_msg: false, success_msg: false })
})
router.post('/contact', (req, res) => {

})

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


module.exports = router;
