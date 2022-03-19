const bcrypt = require("bcryptjs");
const User = require('../../../models/user');

module.exports = function (app) {
    app.post('/users/signup', function (req, res) {
        console.log(req.body);
        const REQUIRED_FIELDS = ['email', 'password', 'repeat_password', 'username'];
        const MISSING_FIELDS = [];
        REQUIRED_FIELDS.forEach(field => {
            if (!req.body[field]) {
                MISSING_FIELDS.push(field);
            }
        });

        const ERROR_FIELDS = [];
        const ERROR_MESSAGES = [];

        // check for all errors at once, to make registering possible in less requests and less annoying
        if (MISSING_FIELDS.length > 0) {
            ERROR_FIELDS.push(...MISSING_FIELDS);
            ERROR_MESSAGES.push("Missing details in request");
        }
        if (req.body.password.length < 8) {
            ERROR_FIELDS.push('password');
            ERROR_MESSAGES.push("Password must be at least 8 characters long");
        }
        if (req.body.password != req.body.repeat_password) {
            ERROR_FIELDS.push(...['password', 'repeat_password']);
            ERROR_MESSAGES.push("Passwords must match");
        }

        if (ERROR_FIELDS.length > 0) {
            return res.status(400).json({ error: true, fields: ERROR_FIELDS, message: ERROR_MESSAGES.join("<br/>") });
        }

        User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] },
            async (err, doc) => {
                if (err) throw err;
                if (doc) {
                    const fields = [doc.username == req.body.username ? 'username' : null, doc.email == req.body.email ? 'email' : null];
                    return res.status(400).json({ error: true, fields: fields, message: "User already exists" });
                }
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
                catch (err) {
                    const prettyErrors = Object.values(err.errors).map(e => e.properties.message).join("\n");
                    res.status(400).json({ error: true, fields: Object.keys(err.errors), message: prettyErrors });
                }
            }
        );
    });


};