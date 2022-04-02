const Timetable = require('../../../models/timetable');
const xssFilters = require('xss-filters');

module.exports = (app) => {
    app.post('/timetable', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const title = xssFilters.inHTMLData(body.title.trim());
        const user = req.user._id;

        if (title == "") return res.status(400).json({ error: true, message: "All fields are required" });
        if (title.length > 1000) return res.status(400).json({ error: true, message: "Title length must be below 1000 characters" });
        
        const timetable = new Timetable({ user, title });

        timetable.save((err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });
};