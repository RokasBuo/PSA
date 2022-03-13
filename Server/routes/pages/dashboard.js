const path = require('path');
module.exports = function (app) {
    app.get("/", async (req, res) => {
       // if (!req.user) return res.redirect("/login");
        res.sendFile(path.join(appRoot + "/views/index.html"));
    });
};