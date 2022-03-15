const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-email');

const schema = new Schema({
    is_admin: {
        type: Boolean,
        default: false,
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
    email: {
        type: mongoose.SchemaTypes.Email,
        trim: true,
        lowercase: true,
        unique: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', schema);