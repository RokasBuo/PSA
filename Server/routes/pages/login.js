const path = require('path');
module.exports = function (app) {
    app.get("/login", async (req, res) => {
        if (req.user) return res.redirect("/");
        res.sendFile(path.join(appRoot + "/views/login.html"));
    });
};