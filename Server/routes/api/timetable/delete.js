const Timetable = require('../../../models/timetable');

module.exports = (app) => {
    app.delete('/timetable', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const user = req.user._id;
        const id = body.id;

        if(!('id' in body)) return res.status(400).json({ error: true, message: "No ID specified" });

        if (req.user.is_admin) {
            Timetable.deleteOne({ _id: id }, (err, doc) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                return res.json({ success: true, result: doc });
            });
            return;
        }

        Timetable.deleteOne({ user, _id: id }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, result: doc });
        });
    });
};