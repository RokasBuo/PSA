const passport = require('passport');
const User = require("../../../models/user");
const bcrypt = require("bcryptjs");
module.exports = function (app) {
    app.post('/users/change-pass', async (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: true, message: "You are not logged in" });
            return;
        }
        const body = req.body;
        console.log(body);
        if (body.repeatpassword != body.newpassword) {
            return res.status(400).json({ error: true, message: "New password and repeat password dont match." });
        }
        if (body.newpassword.length == 0 || body.oldpassword.length == 0) {
            return res.status(400).json({ error: true, message: "Please fill in all fields." });
        }
        const uid = req.user._id;
        const user = await User.findById(uid);
        console.log(user);
        const status = await bcrypt.compare(body.oldpassword, user.password);
        if (!status && body.oldpassword.length !== 0) {
            return res.status(400).json({ error: true, message: "Current password is invalid." });
        }
        const hashedPassword = await bcrypt.hash(req.body.newpassword, 10);
        console.log(hashedPassword);
        const updatedUser = await User.findByIdAndUpdate(
            { _id: uid },
            {
                password: hashedPassword,
            },
            { new: true, runValidators: true }
        );
        return res.status(200).json({ success: true, message: "Changed password successfuly." });
    });
};