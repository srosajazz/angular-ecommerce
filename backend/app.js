const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const routeProducts = require('./routes/produtcs');
const routeOrders = require('./routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); // only simple Data
app.use(bodyParser.json()); // Only body data


//CORS
app.use((req, res, next) => {
    res.header('Access-Control_Allow-Origin', '*');
    res.header(
        'Access-Control_Allow-Header', 'Content-Type',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        Response.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

app.use('/products', routeProducts);
app.use('/order', routeOrders);

//Routes not found:
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        error: {
            messagem: error.message,
        }
    });
});

module.exports = app;