require('dotenv').config();
const morganBody = require('morgan-body');
const { API_VERSION, GENERAL_PORT } = process.env;
const userRoute = require('./route/user-route');
const orderRoute = require('./route/order-route');
const productRoute = require('./route/product-route');

// Express Initialization
const express = require('express');
// const cors = require('cors');
const app = express();
app.get('/api/health', (req, res) => {
    res.sendStatus(200);
});

app.set('trust proxy', true);
app.set('json spaces', 2);

app.use(express.static('public'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
morganBody(app, { logResponseBody: false });

// CORS allow all
// app.use(cors());

// API routes
app.use('/api/' + API_VERSION, [userRoute, orderRoute, productRoute]);

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

app.listen(GENERAL_PORT, async () => {
    console.log(`Server is listening on port: ${GENERAL_PORT}`);
});
module.exports = app;
