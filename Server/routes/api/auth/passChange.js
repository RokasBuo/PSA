const passport = require('passport');
const User = require("../../../models/user");
const bcrypt = require("bcryptjs");
const xssFilters = require('xss-filters');
module.exports = function (app) {
    app.post('/users/change-pass', async (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: true, message: "You are not logged in" });
            return;
        }
        const body = req.body;
        const UPDATE = {};
        console.log(body);
        if (Object.keys(body).length < 2) {
            return res.status(400).json({ error: true, message: "At least 2 fields are required." });
        }
        if (body.oldpassword == null) {
            return res.status(400).json({ error: true, message: "Current password is required." });
        }
        if (body.newpassword != null) {
            if (body.repeatpassword != body.newpassword) {
                return res.status(400).json({ error: true, message: "New password and repeat password dont match." });
            }
            if (body.newpassword.length == 0 || body.oldpassword.length == 0) {
                return res.status(400).json({ error: true, message: "Please fill in all password fields." });
            }
        }
        const uid = req.user._id;
        const user = await User.findById(uid);
        console.log(user);
        if (body.username != null) {
            const username = xssFilters.inHTMLData(body.username);
            if (username.length > 0) {
                UPDATE.username = username;
            }
        }


        const status = await bcrypt.compare(body.oldpassword, user.password);
        if (!status && body.oldpassword.length !== 0) {
            return res.status(400).json({ error: true, message: "Current password is invalid." });
        }
        if (body.newpassword != null) {
            const hashedPassword = await bcrypt.hash(req.body.newpassword, 10);
            UPDATE.password = hashedPassword;
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: uid },
                UPDATE,
                { new: true, runValidators: true }
            );
            return res.status(200).json({ success: true, message: "Updated successfuly." });
        } catch (error) {
            if (error.keyValue.username != null && error.code === 11000) {
                return res.status(500).json({ error: true, message: "This username is already taken." });
            }
            return res.status(500).json({ error: true, message: error.message });
        }

    });
};