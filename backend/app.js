const express = require('express');
const app = express();

const routeProducts = require('./routes/produtcs');
const routeOrders = require('./routes/orders');


app.use('/products', routeProducts);
app.use('/order', routeOrders);

module.exports = app;