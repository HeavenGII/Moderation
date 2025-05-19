module.exports = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    
    console.log('Session user:', req.session.user);
    
    // Use the correct property name from your session (userid)
    req.user = {
        userId: req.session.user.userid // matches your session data
    };
    
    next();
};