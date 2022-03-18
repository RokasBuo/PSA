const model = require('../../../models/audio');
const multer = require('multer');


module.exports = function (app) {
    app.post("/audio", async (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const upload = multer({
            dest: `public/uploads/audio/${req.user._id}/`,
            limits: { fileSize: 30000 }
        }).single('file');
        upload(req, res, err => {
            console.log("FILE", req.file);
            const audio = new model({
                user: req.user._id,
                filename: req.file.filename,
            });
            if (!req.file) return res.status(400).json({ error: true, message: "no valid file specified" });
            try {
                audio.save();
                return res.status(200).json({ success: true, id: audio._id, filename: req.file.filename });
            } catch (err) {
                const prettyErrors = Object.values(err.errors).map(e => e.properties.message).join("\n");
                return res.status(400).json({ error: true, message: prettyErrors });
            }
        });
    });
};