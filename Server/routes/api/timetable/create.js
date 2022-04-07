const Timetable = require('../../../models/timetable');
const xssFilters = require('xss-filters');

module.exports = (app) => {
    app.post('/timetable', (req, res) => {
        console.log("creating!");
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const title = xssFilters.inHTMLData(body.title.trim());
        const user = req.user._id;
        const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const day = body.day.toLowerCase();
        const time = Number(body.time);
        let color = body.color;
        const COLORS = ['brown', 'blue', 'cyan', 'white', 'orange', 'coffee', 'green'];
        if (!COLORS.includes(color)) {
            color = "green";
        }

        if (!DAYS.includes(day)) return res.status(400).json({ error: true, message: "Invalid day given" });
        if (isNaN(time) || time > 6 || time < 1) return res.status(400).json({ error: true, message: "Invalid time given" });
        if (title == "") return res.status(400).json({ error: true, message: "All fields are required" });
        if (title.length > 1000) return res.status(400).json({ error: true, message: "Title length must be below 1000 characters" });
        
        const timetable = new Timetable({ user, title, day, time, color });

        timetable.save((err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, message: "success", result: doc });
        });
    });
};