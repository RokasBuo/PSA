const path = require('path');
module.exports = function (app) {
    app.get("/game", async (req, res) => {
        if (!req.user) return res.redirect("/");
        res.sendFile(path.join(appRoot + "/views/game.html"));
    });
};