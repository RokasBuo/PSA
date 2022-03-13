const { getDailyQuote } = require('../../../utils/helpers');
const userQuotes = require('../../../models/user_quotes');
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
            console.log(err, doc);
            if (err) throw err;
            if (doc) { return res.json({success: true, quote: doc.quote, author: req.user.username }); }
            const quote = getDailyQuote(now, app.locals.quotes);
            res.json({success: true, ...quote});
        });
    });
};