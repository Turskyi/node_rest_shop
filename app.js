const express = require('express');

const app = express();
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

// logger
app.use(morgan('dev'));

// Routes that should handle requests
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);

app.use((request, response, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, reqest, response, next) => {
    response.status(error.status || 500);
    response.json({
        error: {
            message: error.message,
        }
    });
})

module.exports = app;