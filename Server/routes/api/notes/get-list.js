const Notes = require('../../../models/notes');

module.exports = (app) => {
    app.get('/notes-list', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const user = req.user._id;
        const query = req.query;
        if (Object.keys(query).length == 0) {
            Notes.find({ user: user }, (err, doc) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                const now = new Date();
                return res.json({ success: true, result: doc, now: now });
            });
        } else {
            console.log("QUERY:", query);
            const offset = (query.pageNumber - 1) * query.pageSize || 0;
            Notes.paginate({ user: user }, { date: -1, limit: query.pageSize || 10, offset: offset }).then(function (result, err) {
                console.log(err, result);
                if (err) {
                    return res.status(500).json({ error: err });
                }
                const now = new Date();
                return res.json({ success: true, result: result, now: now });
            });
        }
    });
};