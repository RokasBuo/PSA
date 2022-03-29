const xssFilters = require('xss-filters');
const Todo = require('../../../models/todo');
module.exports = (app) => {
    app.post('/todo', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const task = xssFilters.inHTMLData(body.task.trim());
        const user = req.user._id;

        if (!task) return res.status(400).json({ error: true, message: "Task is required" });
        if (task.length > 1000) return res.status(400).json({ error: true, message: "Task length must be below 1000 characters" });
        
        const todo = new Todo({ user, task, state: "active" });

        todo.save((err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, result: doc });
        });
    });
};