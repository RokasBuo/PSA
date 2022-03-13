const userQuotes = require('../../../models/user_quotes');

module.exports = function (app) {
    app.post("/quote", async (req, res) => {
        if (!req.user) return res.status(401).json({error: true, message: "You must be logged in"});
        const body = req.body;

        let doc = await userQuotes.findOneAndUpdate({ user: req.user._id }, { quote: body.quote }, {
            new: true, // return the inserted quote
            upsert: true // Make this update into an upsert
        });
        return res.status(200).json({success: true, quote: doc.quote, author: req.user.username});
    });
};