const path = require('path');
const session = require('express-session');
const config = require('./config');
const express = require("express");
const app = express();
const db = require('./utils/db');
const passport = require('passport');
const { loadQuotes } = require('./utils/helpers');
const fs = require('fs');
require('./utils/auth');
app.use(express.json());

global.appRoot = path.resolve(__dirname);

// TODO: set session secret
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

function processRoutePath(route_path) {
    fs.readdirSync(route_path).forEach(function(file) {
        var filepath = route_path + '/' + file;
        fs.stat(filepath, function(err,stat) {
            if (stat.isDirectory()) {
                processRoutePath(filepath);
            } else {
                console.info('Loading route: ' + filepath);
                require(filepath)(app);
            }
        });
    });
}

function log(...data) {
    data = data.join(" ");
    console.log(`[${new Date().toISOString()}] ${data}`);
}

app.use(express.static(path.join(__dirname, 'public')));

(async () => {
    processRoutePath(__dirname + "/routes");

    log("connecting to db...");
    const connection = await db.connect();
    log("connected!");
    log("loading quotes...");
    loadQuotes(app);
    log("loaded!");
    log("starting server...");
    await app.listen(config.port);

    log(`web server active on port ${config.port}. http://localhost:${config.port}`);
})();