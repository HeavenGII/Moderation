const db = require('../db'); // Подключение к вашей базе данных PostgreSQL

module.exports = async function(req, res, next) {
    if (!req.session.user) {
        return next();
    }

    try {
        const result = await db.query('SELECT * FROM Users WHERE userId = $1', [req.session.user._id]);
        req.user = result.rows; // Получаем первого пользователя из результата
    } catch (e) {
        console.error(e);
    }
    
    next();
}