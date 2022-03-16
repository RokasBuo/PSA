module.exports = function (app) {
    app.get('/users/logout', (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: true, message: "You are not logged in" });
            next(err);
            return;
        }
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    });

};