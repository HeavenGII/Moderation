const { Router } = require('express');
const auth = require('../middleware/auth');
const db = require('../db');
const keys = require('../keys');
const nodemailer = require('nodemailer')
const router = Router();

const transporter = nodemailer.createTransport({
    host: keys.SMTP_HOST,
    port: keys.SMTP_PORT,
    secure: true,
    auth: {
        user: keys.SMTP_USER,
        pass: keys.SMTP_PASSWORD
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const vacancyId = req.params.id

        const result = await db.query(`
            SELECT v.*, u.nickname as author_name, u.email as author_email
            FROM vacancy v
            LEFT JOIN users u ON v.userid = u.userid
            WHERE v.vacancyid = $1
        `, [vacancyId])

        if (result.rows.length === 0) {
            req.flash('error', 'Вакансия не найдена')
            return res.redirect('home')
        }

        const vacancy = result.rows[0]
        
        res.render('vacancy', {
            title: `Модерация: ${vacancy.title}`,
            vacancy: vacancy,
            csrfToken: req.csrfToken()
        })

    } catch (e) {
        console.error('Ошибка при просмотре вакансии:', e)
        req.flash('error', 'Ошибка при загрузке вакансии')
        res.redirect('home')
    }
})

router.post('/:id/approve', auth, async (req, res) => {
    try {
        const vacancyId = req.params.id

        const vacancyResult = await db.query(
            `SELECT v.title, u.email 
             FROM vacancy v 
             JOIN users u ON v.userid = u.userid 
             WHERE v.vacancyid = $1`,
            [vacancyId]
        )

        await db.query(
            'UPDATE vacancy SET isconfirm = true WHERE vacancyid = $1',
            [vacancyId]
        )

        if (vacancyResult.rows[0]) {
            const { email, title } = vacancyResult.rows[0]
            
            const mailOptions = {
                from: keys.EMAIL_FROM,
                to: email,
                subject: `Вакансия опубликована: ${title}`,
                html: `
                    <h2>Ваша вакансия успешно прошла модерацию!</h2>
                    <p><strong>Название вакансии:</strong> ${title}</p>
                    <p>Теперь ваша вакансия доступна для просмотра всем пользователям.</p>
                    <p>Вы можете просмотреть её на <a href="${keys.BASE_URL}/vacancies/${vacancyId}">странице вакансии</a>.</p>
                    <p>Спасибо, что используете наш сервис!</p>
                `
            }

            await transporter.sendMail(mailOptions)
        }

        res.redirect('/home')
    } catch (e) {
        console.error('Ошибка при подтверждении вакансии:', e)
        req.flash('error', 'Ошибка при подтверждении вакансии')
        res.redirect('/home')
    }
});

router.post('/:id/reject', auth, async (req, res) => {
    try {
        const vacancyId = req.params.id
        const { reason } = req.body

        const vacancyResult = await db.query(
            'SELECT u.email, v.title FROM vacancy v JOIN users u ON v.userid = u.userid WHERE v.vacancyid = $1',
            [vacancyId]
        )
        
        await db.query(
            'DELETE FROM vacancy WHERE vacancyid = $1',
            [vacancyId]
        )
        if (vacancyResult.rows[0]) {
            const mailOptions = {
                from: keys.EMAIL_FROM,
                to: vacancyResult.rows[0].email,
                subject: `Вакансия отклонена: ${vacancyResult.rows[0].title}`,
                html: `
                    <h2>Ваша вакансия была отклонена модератором</h2>
                    <p><strong>Причина:</strong> ${reason || 'не указана'}</p>
                    <p>Вы можете создать новую вакансию с учетом замечаний.</p>
                `
            }
            await transporter.sendMail(mailOptions)
        }
        res.redirect('/home')
    } catch (e) {
        console.error('Ошибка при отклонении вакансии:', e)
        req.flash('error', 'Ошибка при отклонении вакансии')
        res.redirect('/home')
    }
})

module.exports = router