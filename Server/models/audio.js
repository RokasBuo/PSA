const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    // foreign key relationship
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    filename: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    filetype: {
        type: String,
    },
});

module.exports = mongoose.model('audio_memos', schema);