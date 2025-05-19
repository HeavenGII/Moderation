const {Router} = require('express')
const Vacancy = require('../models/vacancy')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, (req,res)=>{
    res.render('add', {
        title: 'Добавить вакансию',
        isAdd: true
    })
})

router.post('/', auth, async (req,res)=>{
    const vacancy = new Vacancy({
        title: req.body.title,
        salary: req.body.salary,
        information: req.body.information,
        userId: req.user
    })
    try
        {
            await vacancy.save()
        }
    catch(e){
        console.log(e)
    }

    res.redirect('/vacancies')
})

module.exports = router