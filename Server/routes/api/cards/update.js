const xssFilters = require('xss-filters');
const Card = require('../../../models/cards');

module.exports = (app) => {
    app.patch('/todo', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const user = req.user._id;
        const id = body.id;
        const data = {  };

        if(body.question) {
            data.question = xssFilters.inHTMLData(body.question.trim());
        }
        if(body.answer) {
            data.answer = xssFilters.inHTMLData(body.answer.trim());
        }
        if(body.group) {
            data.group = xssFilters.inHTMLData(body.group.trim());
        }
        
        if (Object.keys(data).length == 0 || !id) return res.status(400).json({ error: true, message: "All fields are required" });
        if (data.question?.length + data.answer?.length + data.group?.length > 1000) return res.status(400).json({ error: true, message: "Fields are too long." });

        if (req.user.is_admin) {
            Card.updateOne({ _id: id }, { $set: data }, (err, doc) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                return res.json({ success: true, result: doc });
            });
            return;
        }

        Card.updateOne({ user, _id: id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, result: doc });
        });
    });
};