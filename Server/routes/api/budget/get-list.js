const Budget = require('../../../models/budget');

module.exports = (app) => {
    app.get('/budget-list', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const user = req.user._id;

        Budget.find({ user: user }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            const now = new Date();
            return res.json({ success: true, result: doc, now: now });
        });
    });
};