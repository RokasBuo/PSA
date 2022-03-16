const passport = require('passport');

module.exports = function (app) {
    app.post('/users/login', (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) throw err;
            if (!user) return res.status(400).json({ error: true, message: "User with specified credentials not found" });
            req.logIn(user, (err) => {
                if (err) throw err;
                res.json({ success: true, message: "You have succesfully logged in" });
            });
        })(req, res, next);
    });
};