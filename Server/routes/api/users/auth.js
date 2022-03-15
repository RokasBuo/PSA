const passport = require('passport');
const bcrypt = require("bcryptjs");
const User = require('../../../models/user');

module.exports = function (app) {
    app.post('/users/signup', function (req, res) {
        console.log(req.body);
        if (!req.body.email || !req.body.password || !req.body.username) return res.status(400).json({ error: true, message: "Missing details in request." });
        if (req.body.password != req.body.repeat_password) return res.status(400).json({ error: true, message: "Passwords must match." });
        User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] },
            async (err, doc) => {
                if (err) throw err;
                if (doc) return res.status(400).json({ error: true, message: "User already exists" });
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const user = new User({
                    username: req.body.username,
                    password: hashedPassword,
                    email: req.body.email,
                });
                try {
                    await user.save();
                    res.status(201).json({ success: true });
                }
                catch(err) {
                    const prettyErrors = Object.values(err.errors).map(e => e.properties.message).join("\n");
                    res.status(400).json({ error: true, message: prettyErrors });
                }
            }
        );
    });

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

    app.get('/users/session', (req, res) => {
        if (!req.user) {
            return res.status(401).json({ error: true, message: "You are not authenticated" });
        }
        res.json({ success: true, session: req.session, user: req.user });
    });

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