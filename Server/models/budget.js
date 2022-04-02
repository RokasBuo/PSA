const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Budget', schema);