const Budget = require('../../../models/budget');

module.exports = (app) => {
    app.get('/admin/budget-list', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        if (!req.user.is_admin) return res.status(401).json({ error: true, message: "You don't have permission to view this" });

        Budget.find({ }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            const now = new Date();
            return res.json({ success: true, result: doc, now: now });
        });
    });
};