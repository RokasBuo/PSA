const Notes = require('../../../models/notes');
const xssFilters = require('xss-filters');

module.exports = (app) => {
    app.post('/notes', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const text = xssFilters.inHTMLData(body.text.trim());
        const title = xssFilters.inHTMLData(body.title.trim());
        const user = req.user._id;

        if (title == "" || text == "") return res.status(400).json({ error: true, message: "All fields are required" });

        const note = new Notes({ user, text, title });

        note.save((err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });
};