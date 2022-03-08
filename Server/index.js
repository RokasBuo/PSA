const path = require('path');
const session = require('express-session');
const config = require('./config');
const express = require("express");
const app = express();
const db = require('./utils/db');
const passport = require('passport');
const { loadQuotes, getDailyQuote } = require('./utils/utils');
const userQuotes = require('./models/user_quotes');
// TODO: load routes dynamically
const usersRouter = require('./routes/users');
const quoteRouter = require('./routes/api/quotes/get-one');
require('./utils/auth');
app.use(express.json());

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

app.post("/quote", async (req, res) => {
    if (!req.user) return res.status(401).send("unauthorized!");
    const body = req.body;
    console.log(body);
    console.log(req.user);
    let doc = await userQuotes.findOneAndUpdate({ user: req.user._id }, { quote: body.quote }, {
        new: true, // return the inserted quote
        upsert: true // Make this update into an upsert
    });
    console.log(doc);
    return res.status(200).send("success");
});

app.get("/quote", async (req, res) => {
    if (!req.user) return res.status(401).send("unauthorized!");
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    // TODO: this would be prettier as a promise and async/await
    userQuotes.findOne({
        date: {
            $gte: now
        },
        user: req.user._id
    }, (err, doc) => {
        if (err) throw err;
        console.log(doc);
        if (doc) { return res.json(doc); }
        const quote = getDailyQuote(now, app.locals.quotes);
        console.log(quote);
        res.json(quote);
    });
});

app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

(async () => {
    const connection = await db.connect();
    loadQuotes(app);
    await app.listen(config.port);

    console.log(`[${new Date().toISOString()}] web server active on port ${config.port}. http://localhost:${config.port}`);
})();