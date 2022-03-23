const xssFilters = require('xss-filters');
const Todo = require('../../models/todo');

module.exports = (app) => {
    app.patch('/todo', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const user = req.user._id;
        const id = body.id;
        const task = xssFilters.inHTMLData(body.task.trim());
        const state = xssFilters.inHTMLData(body.state.trim());
        const data = { task, state };

        if (task == "" || state == "" || !id) return res.status(400).json({ error: true, message: "All fields are required" });



        Todo.updateOne({ user, _id: id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, result: doc });
        });
    });
};