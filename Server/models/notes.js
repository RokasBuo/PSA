const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        trim: true
    },
    text: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Notes', schema);