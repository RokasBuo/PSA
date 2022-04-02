const Budget = require('../../../models/budget');
const xssFilters = require('xss-filters');

module.exports = (app) => {
    app.patch('/budget', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const user = req.user._id;
        const id = body.id;
        const type = xssFilters.inHTMLData(body.type.trim());
        const amount = Number(body.amount);

        const data = { type, amount };

        if (type == "" || body.amount == "") return res.status(400).json({ error: true, message: "All fields are required" });
        if (type.length > 1000) return res.status(400).json({ error: true, message: "Type length must be below 1000 characters" });
        if (isNaN(amount)) return res.status(400).json({ error: true, message: "Amount must be a number" });

        Budget.updateOne({ user, _id: id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, result: doc });
        });
    });
};