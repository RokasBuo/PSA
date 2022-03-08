const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    quote:   {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        default: new Date(),
    },
    // foreign key relationship
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports = mongoose.model('User_quotes', schema);