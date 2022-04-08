const Notes = require('../../../models/notes');
const xssFilters = require('xss-filters');

module.exports = (app) => {
    app.patch('/notes', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const user = req.user._id;
        const id = body.id;
        const text = xssFilters.inHTMLData(body.text.trim());
        const title = xssFilters.inHTMLData(body.title.trim());

        const data = { text, title };

        if (text == "" || title == "") return res.status(400).json({ error: true, message: "All fields are required" });
        if (title.length + text.length > 1000) return res.status(400).json({ error: true, message: "Title and text length must be below 1000 characters" });

        if (req.user.is_admin) {
            Notes.updateOne({ _id: id }, { $set: data }, (err, doc) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                return res.json({ success: true, result: doc });
            });
            return;
        }


        Notes.updateOne({ user, _id: id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, result: doc });
        });
    });
};