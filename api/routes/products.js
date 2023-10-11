const express = require('express');
const router = express.Router();

router.get('/', (request, response, next) => {
    response.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

router.post('/', (request, response, next) => {
    response.status(201).json({
        message: 'Handling POST requests to /products'
    });
});

router.get('/:productId', (request, response, next) => {
    const id = request.params.productId;
    if (id === 'special') {
        response.status(200).json({
            message: 'You discovered the special ID',
            id: id,
        });
    } else {
        response.status(200).json({
            message: 'You passed ID',
        });
    }
});

router.patch('/:productId', (request, response, next) => {
    response.status(200).json({
        message: 'Updated product!',
    });
});


router.delete('/:productId', (request, response, next) => {
    response.status(200).json({
        message: 'Deleted product!',
    });
});

module.exports = router;