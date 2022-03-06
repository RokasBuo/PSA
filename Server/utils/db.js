const mongoose = require('mongoose');
const config = require('../config');
const connect = () => {
    return mongoose.connect(config.database.uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

module.exports = { connect };