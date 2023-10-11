const express = require('express');
const router = express.Router();

// Hndle income GET requests to /orders
router.get('/', (request, response, next) => {
    response.status(200).json({
        message: 'Orders were fetched'
    });
});

router.get('/:orderId', (request, response, next) => {
    response.status(200).json({
        message: 'Orders details',
        orderId: request.params.orderId,
    });
});

router.delete('/:orderId', (request, response, next) => {
    response.status(200).json({
        message: 'Orders deleted',
        orderId: request.params.orderId,
    });
});

router.post('/', (request, response, next) => {
    response.status(201).json({
        message: 'Orders was created'
    });
});

module.exports = router;