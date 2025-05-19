const { Router } = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { validationResult } = require('express-validator')
const User = require('../models/moderators')
require('dotenv').config()
const {registerValidators} =require('../utils/validators')
const router = Router()

router.get('/', (req,res)=>{
    res.render('addModerator', {
        title: "AddModerator",
        isModerator: true
    });
})


router.post('/register', async (req, res) => {
    try {
        const { surname, name, secondname, login, password } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            surname, name, secondname, login, password: hashPassword
        });
        await user.save();
        res.redirect('/');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;