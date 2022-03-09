const userQuotes = require('../../../models/user_quotes');

module.exports = function (app) {
    app.post("/quote", async (req, res) => {
        if (!req.user) return res.status(401).send("unauthorized!");
        const body = req.body;

        // TODO: split into author and quote so it matches json? 
        let doc = await userQuotes.findOneAndUpdate({ user: req.user._id }, { quote: body.quote }, {
            new: true, // return the inserted quote
            upsert: true // Make this update into an upsert
        });
        return res.status(200).send("success");
    });
};