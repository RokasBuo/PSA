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
    day: {
        type: String,
        trim: true,
    },
    time: {
        type: Number,
    },
    color: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Timetable', schema);