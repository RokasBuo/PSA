const Timetable = require('../../../models/timetable');

module.exports = (app) => {
    app.get('/timetable-list', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const user = req.user._id;

        Timetable.find({ user: user }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            const now = new Date();
            return res.json({ success: true, result: doc, now: now });
        });

    });
};