const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    // foreign key relationship
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    filename: {
        type: String
    },
    length: {
        type: String
    },
    date: {
        type: Date,
        default: new Date(),
    },
});

module.exports = mongoose.model('audio_memos', schema);