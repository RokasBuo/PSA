const fs = require('fs').promises;
const path = require("path");
const model = require('../../../models/audio');

module.exports = function (app) {
    app.delete("/audio-memos", async (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        model.deleteOne({ user: req.user._id, filename: body.filename }).then(async (doc, err) => {
            if (err) return res.status(500).json({ error: true, message: err.message });
            if (!doc.deletedCount) {
                return res.status(404).json({ error: true, message: "Nothing to delete" });
            }
            const deletion = await fs.unlink(path.join(appRoot + `/public/uploads/audio/${req.user._id}/${body.filename}`));
            console.log(deletion);
            res.json({ success: true, doc });
        });
    });
};