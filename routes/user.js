const { Router } = require('express')
const db = require('../db')
const auth = require('../middleware/auth')
const router = Router()

router.get('/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id
    const currentUser = req.session.user
    
    if (!currentUser.isAdmin && !currentUser.isModerator) {
      return res.status(403).render('error', {
        title: 'Доступ запрещен',
        message: 'У вас нет прав для просмотра этого профиля',
        user: currentUser
      })
    }

    const result = await db.query(`
      SELECT u.*, p.* 
      FROM Users u
      LEFT JOIN Portfolio p ON u.portfolioId = p.portfolioId
      WHERE u.userId = $1
    `, [userId])
    
    if (!result.rows[0]) {
      return res.status(404).render('error', {
        title: 'Пользователь не найден',
        message: `Пользователь с ID ${userId} не существует`,
        user: currentUser
      })
    }

    const { portfolioid, ...user } = result.rows[0]
    const portfolio = result.rows[0].portfolioid ? result.rows[0] : {}

    res.render('user-profile', {
      title: `${user.nickname || user.email.split('@')[0]} - Профиль`,
      user: user,
      portfolio: portfolio,
      currentUser: currentUser,
      isAdminView: currentUser.isAdmin,
      isModeratorView: currentUser.isModerator,
      csrfToken: req.csrfToken(),
      helpers: {
        formatDate: function(date) {
          if (!date) return '';
          return new Date(date).toLocaleDateString('ru-RU')
        }
      }
    })
  } catch (e) {
    console.error('Ошибка при получении профиля пользователя:', e);
    res.status(500).render('error', {
      title: 'Ошибка сервера',
      message: 'Произошла ошибка при загрузке профиля',
      error: e,
      user: req.session.user || null
    })
  }
})

router.post('/:id/delete', auth, async (req, res) => {
  try {
    const userId = req.params.id
    const currentUser = req.session.user
    
    if (!currentUser.isAdmin && !currentUser.isModerator) {
      return res.status(403).render('error', {
        title: 'Доступ запрещен',
        message: 'У вас нет прав для просмотра этого профиля',
        user: currentUser
      })
    }
    await db.query('BEGIN')
    const userResult = await db.query('SELECT portfolioId FROM Users WHERE userId = $1', [userId])
    const portfolioId = userResult.rows[0]?.portfolioid
    await db.query('DELETE FROM Users WHERE userId = $1', [userId])
    
    if (portfolioId) {
      await db.query('DELETE FROM Portfolio WHERE portfolioId = $1', [portfolioId])
    }
    
    await db.query('DELETE FROM Vacancy WHERE userId = $1', [userId])
    
    await db.query('COMMIT')
    
    res.redirect('/home')
  } catch (e) {
    await db.query('ROLLBACK')
    console.error('Ошибка при удалении пользователя:', e)
    req.flash('error', 'Ошибка при удалении пользователя')
    res.redirect('/admin/dashboard');
  }
})

module.exports = router