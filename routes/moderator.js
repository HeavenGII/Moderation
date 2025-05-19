const { Router } = require('express')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const db = require('../db')
const router = Router()

router.get('/', auth, (req, res) => {
    if (!req.session.user?.isAdmin) {
        return res.status(403).send('Доступ запрещен')
    }
    
    res.render('addModerator', {
        title: "Добавить модератора",
        isModerator: true,
        csrfToken: req.csrfToken()
    })
})

router.post('/register', auth, async (req, res) => {
    try {
        if (!req.session.user?.isAdmin) {
            return res.status(403).send('Доступ запрещен')
        }

        const { surname, name, secondname, login, password } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        
        await db.query(
            'INSERT INTO moderator(surname, name, secondname, login, password) VALUES($1, $2, $3, $4, $5)',
            [surname, name, secondname, login, hashPassword]
        )
        
        req.flash('success', 'Модератор успешно добавлен')
        res.redirect('/home')
    } catch (e) {
        console.error('Error adding moderator:', e)
        req.flash('error', 'Ошибка при добавлении модератора')
        res.redirect('/home')
    }
})

router.post('/:id/delete', auth, async (req, res) => {
    try {
        if (!req.session.user?.isAdmin) {
            return res.status(403).send('Доступ запрещен')
        }
        const moderatorId = req.params.id
    
        const checkResult = await db.query(
            'SELECT * FROM moderator WHERE id = $1', 
            [moderatorId]
        )
        
        if (checkResult.rows.length === 0) {
            req.flash('error', 'Модератор не найден');
            return res.redirect('/home')
        }

        await db.query(
            'DELETE FROM moderator WHERE id = $1',
            [moderatorId]
        )
        
        req.flash('success', 'Модератор успешно удален')
        res.redirect('/home')
    } catch (e) {
        console.error('Error deleting moderator:', e)
        req.flash('error', 'Ошибка при удалении модератора')
        res.redirect('/home')
    }
})

module.exports = router