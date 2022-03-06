const fs = require('fs');

function isLeapYear(date) {
    const year = date.getFullYear();
    if((year & 3) != 0) return false;
    return ((year % 100) != 0 || (year % 400) == 0);
}

// Get Day of Year
function getDOY(date) {
    const dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const mn = date.getMonth();
    const dn = date.getDate();
    let dayOfYear = dayCount[mn] + dn;
    const april_fools = dayOfYear == 91;
    if(mn > 1 && isLeapYear(date)) dayOfYear++;
    return [dayOfYear, april_fools];
}

function getDailyQuote(date, quotes) {
    const [day, april_fools] = getDOY(date);
    console.log(day);
    quotes = quotes.filter(quote => quote.april_fools == april_fools);
    const length = quotes.length;
    if(april_fools) {
        const year = date.getFullYear();
        return quotes[year % length];
    }
    return quotes[day % length];
}

async function loadQuotes(app) {
    fs.readFile("quotes.json", "utf-8", (err, data) => {
        if(err) throw err;
        const quotes = JSON.parse(data);
        app.locals.quotes = quotes;
    });
}


module.exports = {
    getDailyQuote,
    loadQuotes
};