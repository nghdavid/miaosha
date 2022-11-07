require('dotenv').config();
const morganBody = require('morgan-body');
const { API_VERSION } = process.env;
const miaoshaRoute = require('./route/miaosha-route');

// Express Initialization
const express = require('express');
const cors = require('cors');
const app = express();

app.set('trust proxy', true);
app.set('json spaces', 2);

app.use(express.static('public'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
morganBody(app, { logResponseBody: false });

// CORS allow all
app.use(cors());

app.get('/', (req, res) => {
    res.redirect('/main.html');
});
// API routes
app.use('/api/' + API_VERSION, [miaoshaRoute]);

// Page not found
app.use(function (req, res, next) {
    res.status(404).sendFile(__dirname + '/public/404.html');
});

// Error handling
app.use((err, req, res, next) => {
    const status = 500;
    console.error(err);
    res.status(status).json({ error: 'Internal Server Error' });
});

module.exports = app;
