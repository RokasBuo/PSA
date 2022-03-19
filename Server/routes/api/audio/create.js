const model = require('../../../models/audio');
const multer = require('multer');


module.exports = function (app) {
    app.post("/audio", async (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const upload = multer({
            dest: `public/uploads/audio/${req.user._id}/`,
            limits: { fileSize: 102400 }
        }).single('file');
        upload(req, res, err => {
            console.log("FILE", req.file, req.body);
            if (!req.file) return res.status(400).json({ error: true, message: "no valid file specified" });
            const audio = new model({
                user: req.user._id,
                filename: req.file.filename,
                length: req.body.length,
                filetype: req.body.filetype,
            });
            try {
                audio.save();
                return res.status(200).json({ success: true, user: req.user._id, date:audio.date, id: audio._id, filename: req.file.filename, length: req.body.length, filetype: req.body.filetype });
            } catch (err) {
                const prettyErrors = Object.values(err.errors).map(e => e.properties.message).join("\n");
                return res.status(400).json({ error: true, message: prettyErrors });
            }
        });
    });
};