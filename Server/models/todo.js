const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    task: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        enum: ['active', 'completed', 'removed']
    }
});

module.exports = mongoose.model('Todo', schema);