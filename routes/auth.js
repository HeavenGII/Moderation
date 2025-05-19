const { Router } = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const db = require('../db')
require('dotenv').config()
const router = Router()


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: "Authorization",
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body
        
        let queryResult = await db.query(
            'SELECT * FROM Administrator WHERE login = $1', 
            [login]
        )
        
        let user
        if (queryResult.rows.length > 0) {
            user = queryResult.rows[0]
            user.isAdmin = true
        } else {
            queryResult = await db.query(
                'SELECT * FROM Moderator WHERE login = $1', 
                [login]
            )
            if (queryResult.rows.length === 0) {
                req.flash('loginError', 'User does not exist')
                return res.redirect('/auth/login#login')
            }
            user = queryResult.rows[0]
            user.isModerator = true
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            req.flash('loginError', 'Incorrect password')
            return res.redirect('/auth/login#login')
        }
        
        req.session.user = {
            id: user.id,
            login: user.login,
            isAdmin: user.isAdmin || false,
            isModerator: user.isModerator || false 
        }
        req.session.isAuthenticated = true;
        
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err)
                return res.status(500).send('Session error')
            }
            res.redirect('/home');
        })
        
    } catch (err) {
        console.error('Login error:', err)
        req.flash('loginError', 'Login failed')
        res.redirect('/auth/login#login')
    }
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

module.exports = router