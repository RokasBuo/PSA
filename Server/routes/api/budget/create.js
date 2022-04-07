const Budget = require('../../../models/budget');
const xssFilters = require('xss-filters');

module.exports = (app) => {
    app.post('/budget', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const user = req.user._id;
        const data = { user };
        for (let key of ['income', 'rent', 'utilities', 'food', 'insurance', 'result', 'savings']) {
            if (!body[key] || body[key] == "" || isNaN(body[key])) {
                return res.status(400).json({ error: true, message: "All fields are required" });
            }
            data[key] = Number(body[key]);
        }
        const budget = new Budget(data);

        budget.save((err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });
};