const path = require('path');
module.exports = function (app) {
    app.get("/admin/notes", async (req, res) => {
        if (!req.user) return res.redirect(401, '/');
        if (!req.user.is_admin) return res.redirect(401, '/');
        res.sendFile(path.join(appRoot + "/views/admin/notes.html"));
    });
};