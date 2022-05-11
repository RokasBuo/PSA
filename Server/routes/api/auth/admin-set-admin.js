const User = require('../../../models/user');

module.exports = (app) => {
    app.post('/admin/set-admin', async (req, res) => {
        if (!req.user) return res.status(401).json({ error: true, message: "You must be logged in" });
        if (!req.user.is_admin) return res.status(401).json({ error: true, message: "You don't have permission to do this" });
        if (!req.body.id) return res.status(400).json({ error: true, message: "All fields are required. " });
        try {
            const user = await User.findByIdAndUpdate(req.body.id, { is_admin: true });
            return res.json({ success: true, user });
        } catch (err) {
            return res.status(400).json({ error: true, message: err.message });
        }

    });
};