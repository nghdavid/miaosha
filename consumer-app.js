require('dotenv').config();
const morganBody = require('morgan-body');

// Express Initialization
const express = require('express');
const app = express();
app.get('/api/health', (req, res) => {
    res.sendStatus(200);
});

app.set('trust proxy', true);
app.set('json spaces', 2);

app.use(express.json());
morganBody(app, { logResponseBody: false });

// Page not found
app.use(function (req, res, next) {
    res.status(404).redirect('/404.html');
});

// Error handling
app.use((err, req, res, next) => {
    const status = 500;
    console.error(err);
    res.status(status).json({ error: 'Internal Server Error' });
});

module.exports = app;
