const User = require('../../../models/user');

module.exports = (app) => {
    app.get('/me', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const {password, updatedAt, __v, _id, createdAt, email, ...user} = req.user._doc;
        return res.json( user );
    });
};