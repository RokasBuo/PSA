const Budget = require('../../../models/budget');

module.exports = (app) => {
    app.delete('/budget', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const user = req.user._id;
        const id = body.id;

        if(!('id' in body)) return res.status(400).json({ error: true, message: "No ID specified" });

        Budget.deleteOne({ user, _id: id }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, result: doc });
        });
    });
};