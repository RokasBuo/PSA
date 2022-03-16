const { getDailyQuote } = require('../../../utils/helpers');
const userQuotes = require('../../../models/user_quotes');

const findQuote = (now, uid) => {
    return new Promise((resolve, reject) => {
        userQuotes.findOne({
            date: {
                $gte: now
            },
            user: uid
        }, (err, doc) => {
            if (err) return reject(err);
            return resolve(doc);
        });
    });
};


module.exports = function (app) {
    app.get("/quote", async (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        const doc = await findQuote(now, req.user._id).catch(err => {
            console.error(err);
            return res.status(500).json({ error: true, message: "Failed fetching a quote, error: " + err.message });
        });
        if (doc) {
            return res.json({ success: true, quote: doc.quote, author: req.user.username });
        }
        const quote = getDailyQuote(now, app.locals.quotes);
        res.json({ success: true, ...quote });
    });
};