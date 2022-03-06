const express = require('express');
const router = express.Router();
const { getDailyQuote } = require('../../../utils/utils');
router.get("/get-one", (req, res) => {
    const date = new Date();
    // cant get app context here without dynamically loading in the routes, I believe. 
    const quote = getDailyQuote(date, app.locals.quotes);
    console.log(quote);
    res.json(quote);
})


module.exports = router;