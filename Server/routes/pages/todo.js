const path = require('path');
module.exports = function (app) {
    app.get("/todo", async (req, res) => {
        if (!req.user) return res.redirect("/");
        res.sendFile(path.join(appRoot + "/views/todo.html"));
    });
};