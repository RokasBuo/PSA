const path = require('path');
module.exports = function (app) {
    app.get("/admin/", async (req, res) => {
        if (!req.user) return res.redirect(401, 'back');
        if (!req.user.is_admin) return res.redirect(401, 'back');
        res.sendFile(path.join(appRoot + "/views/admin/index.html"));
    });
};