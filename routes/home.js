const { Router } = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = Router();

router.get('/home', auth, async (req, res) => {
    try {
        const user = req.session.user
        let data = {
            title: 'Главная',
            user: user || null,
            isHome: true,
            csrfToken: req.csrfToken()
        }
        
        if (user?.isAdmin) {
            const moderators = await db.query('SELECT * FROM moderator')
            data.moderators = moderators.rows
        } else if (user?.isModerator) {
            const users = await db.query('SELECT userid, nickname, email FROM users')
            const unconfirmedVacancies = await db.query(
                'SELECT * FROM vacancy WHERE isConfirm = false'
            )
            data.users = users.rows
            data.unconfirmedVacancies = unconfirmedVacancies.rows
        }

        res.render('home', data)
    } catch (err) {
        console.error('Error in home route:', err)
        res.status(500).render('error', { 
            message: 'Ошибка сервера',
            error: err 
        })
    }
})

module.exports = router