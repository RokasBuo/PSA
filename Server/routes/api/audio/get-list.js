const model = require('../../../models/audio');

module.exports = function (app) {
    app.get("/audio-memos", async (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        model.find({ user: req.user._id }).then((doc, err) => {
            console.log(err, doc);
            if (err) return res.status(500).json({ error: true, message: err.message });
            const list = doc.map(d => {
                return { user: d.user, filename: d.filename, length: d.length, id: d._id, date: d.date, filetype: d.filetype };
            });
            res.json({ success: true, list });
        });


    });
};