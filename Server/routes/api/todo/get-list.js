const Todo = require('../../models/todo');

module.exports = (app) => {
    app.get('/todo-list', (req, res) => {
        if(!req.user) return res.status(401).json({error: true, message: "You must be logged in"});
        const user = req.user._id;
        Todo.find({ user: user }, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.json({ success: true, result: doc });
        });
    });
};