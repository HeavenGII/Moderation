const { Router } = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { validationResult } = require('express-validator')
const User = require('../models/administrator')
require('dotenv').config()
const {registerValidators} =require('../utils/validators')
const router = Router()



router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: "Authorization",
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    });
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    });
});

router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        const candidate = await User.findOne({ login });

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);

            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save((err) => {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/');
                });
            } else {
                req.flash('loginError', 'Incorrect password');
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('loginError', 'User does not exist');
            res.redirect('/auth/login#login');
        }
    } catch (e) {
        console.log(e);
    }
});

router.post('/register', registerValidators, async (req, res) => {
    try {
        const { login, password } = req.body;

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
        login, password: hashPassword
        });
        await user.save();
        res.redirect('/auth/login#login');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;