const { getDailyQuote } = require('../../../utils/utils');
const userQuotes = require('../../../models/user_quotes')
module.exports = function (app) {
    app.get("/quote", async (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in"});
        const now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        // TODO: this would be prettier as a promise and async/await
        userQuotes.findOne({
            date: {
                $gte: now
            },
            user: req.user._id
        }, (err, doc) => {
            if (err) throw err;
            if (doc) { return res.json(doc); }
            const quote = getDailyQuote(now, app.locals.quotes);
            res.json(quote);
        });
    });
};