const { body } = require('express-validator')
const User = require('../models/administrator')

exports.registerValidators = [
    body('email')
     .isEmail().withMessage('input correct email')
      .custom(async (value, {req})=>{
        try{
            const user = await User.findOne({login: value})
            if (user){
                return Promise.reject('This email zanyat')
            }
        } catch(e) {
            console.log(e)
        }
    })
    .normalizeEmail(),
    body('password', 'Password should min 6 symbols')
     .isLength({min: 6, max: 56})
      .isAlphanumeric()
       .trim(),
    body('confirm')
     .custom((value, {req}) =>{
        if(value !== req.body.password){
            throw new Error('Password should be odinakovimi')
        }
        return true
    })
    .trim(),
    body('name').
     isLength({min: 3}).withMessage('Username should be min 3 symbols')
     .trim()
]
