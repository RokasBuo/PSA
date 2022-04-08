const { getDailyQuote } = require('../../../utils/helpers');
const userQuotes = require('../../../models/user_quotes');

const findQuote = () => {
    return new Promise((resolve, reject) => {
        userQuotes.find({}, (err, doc) => {
            if (err) return reject(err);
            return resolve(doc);
        });
    });
};


module.exports = function (app) {
    app.get("/admin/quote-list", async (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        if (!req.user.is_admin) return res.status(401).json({ error: true, message: "You don't have permission to view this" });
        const doc = await findQuote().catch(err => {
            console.error(err);
            return res.status(500).json({ error: true, message: "Failed fetching a quote, error: " + err.message });
        });
        return res.json({ success: true, result: doc });
    });
};