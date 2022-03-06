const path = require('path');
const session = require('express-session');
const config = require('./config');
const express = require("express");
const app = express();
const db = require('./utils/db');
const passport = require('passport');
const { loadQuotes, getDailyQuote } = require('./utils/utils');
// TODO: load routes dynamically
const usersRouter = require('./routes/users');
const quoteRouter = require('./routes/api/quotes/get-one');
require('./utils/auth');

// TODO: set session secret
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", async (req, res) => {
    if (req.user) {
        return res.send(req.user);
    }

    res.send("yep");
});

app.get("/quote", async(req, res) => {
    const date = new Date();
    const quote = getDailyQuote(date, app.locals.quotes);
    console.log(quote);
    res.json(quote);
});

app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

(async () => {
    const connection = await db.connect();
    loadQuotes(app);
    await app.listen(config.port);
    
    console.log(`[${new Date().toISOString()}] web server active on port ${config.port}. http://localhost:${config.port}`);
})();