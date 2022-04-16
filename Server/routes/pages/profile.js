const path = require('path');
module.exports = function (app) {
    app.get("/profile", async (req, res) => {
        if (!req.user) return res.redirect("/");
        res.sendFile(path.join(appRoot + "/views/profile.html"));
    });
};