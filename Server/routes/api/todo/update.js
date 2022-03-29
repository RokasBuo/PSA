const xssFilters = require('xss-filters');
const Todo = require('../../../models/todo');

module.exports = (app) => {
    app.patch('/todo', (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        const body = req.body;
        const user = req.user._id;
        const id = body.id;
        const data = {  };

        if(body.task) {
            data.task = xssFilters.inHTMLData(body.task.trim());
        }
        if(body.state) {
            data.state = xssFilters.inHTMLData(body.state.trim());
        }
        
        if (Object.keys(data).length == 0 || !id) return res.status(400).json({ error: true, message: "All fields are required" });
        if (data.task.length > 1000) return res.status(400).json({ error: true, message: "Task length must be below 1000 characters" });
        Todo.updateOne({ user, _id: id }, { $set: data }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, result: doc });
        });
    });
};