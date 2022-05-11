const fs = require('fs').promises;
const path = require("path");
const model = require('../../../models/audio');

module.exports = function (app) {
    app.delete("/audio-memos", async (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;

        console.log(body.filename);
        if (req.user.is_admin) {
            model.deleteOne({ filename: body.filename }).then(async (doc, err) => {
                if (err) return res.status(500).json({ error: true, message: err.message });
                if (!doc.deletedCount) {
                    return res.status(404).json({ error: true, message: "Nothing to delete" });
                }
                try {
                    const deletion = await fs.unlink(path.join(appRoot + `/public/uploads/audio/${req.user._id}/${body.filename}`));
                    console.log(deletion);
                } catch (err) {
                    console.error(err);
                }
                return res.json({ success: true, doc });
            });
            return;
        }

        model.deleteOne({ user: req.user._id, filename: body.filename }).then(async (doc, err) => {
            if (err) return res.status(500).json({ error: true, message: err.message });
            if (!doc.deletedCount) {
                return res.status(404).json({ error: true, message: "Nothing to delete" });
            } else {
                try {
                    const deletion = await fs.unlink(path.join(appRoot + `/public/uploads/audio/${req.user._id}/${body.filename}`));
                    console.log(deletion);
                } catch (err) {
                    console.error(err);
                }
                return res.json({ success: true, doc });
            }
        });
    });
};