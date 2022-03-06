const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
require('mongoose-type-email');


const schema = new Schema({
    is_admin:   {
        type: Boolean,
        default: false,
    },
    // https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
    email: {
        type: mongoose.SchemaTypes.Email,
        trim: true,
        lowercase: true,
        unique: true,
    }
});

schema.plugin(passportLocalMongoose, {
    limitAttempts: true,
    maxAttempts: 5,
});

module.exports = mongoose.model('User', schema);