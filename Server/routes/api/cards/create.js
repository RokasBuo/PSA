const xssFilters = require('xss-filters');
const Card = require('../../../models/cards');
module.exports = (app) => {
    app.post('/cards', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const group = xssFilters.inHTMLData(body.group.trim());
        const question = xssFilters.inHTMLData(body.question.trim());
        const answer = xssFilters.inHTMLData(body.answer.trim());
        const user = req.user._id;

        if (!group || !question || !answer) return res.status(400).json({ error: true, message: "All fields are required" });
        if (group.length + question.length + answer.length > 1000) return res.status(400).json({ error: true, message: "Fields are too long." });
        
        const card = new Card({ user, group, question, answer });

        card.save((err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, result: doc });
        });
    });
};