const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    income: {
        type: Number,
    },
    rent: {
        type: Number,
    },
    utilities: {
        type: Number,
    },
    food: {
        type: Number,
    },
    insurance: {
        type: Number,
    },
    result: {
        type: Number,
    },
    savings: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Budget', schema);