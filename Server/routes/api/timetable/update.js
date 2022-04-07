const Timetable = require('../../../models/timetable');
const xssFilters = require('xss-filters');

module.exports = (app) => {
    app.patch('/timetable', (req, res) => {
        console.log("updating!");
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const user = req.user._id;
        const id = body.id;
        const title = xssFilters.inHTMLData(body.title.trim());
        let color = body.color;
        const COLORS = ['brown', 'blue', 'cyan', 'white', 'orange', 'coffee', 'green'];
        if (!COLORS.includes(color)) {
            color = "green";
        }

        const data = { title, color };

        if (title == "") return res.status(400).json({ error: true, message: "Title field is required" });
        if (title.length > 1000) return res.status(400).json({ error: true, message: "Title length must be below 1000 characters" });

        Timetable.updateOne({ user, _id: id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, result: doc });
        });
    });
};