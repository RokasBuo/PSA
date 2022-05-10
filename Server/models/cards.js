const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    // foreign key relationship
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    group: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    question: {
        type: String,
    },
    answer: {
        type: String,
    }
});

module.exports = mongoose.model('cards', schema);