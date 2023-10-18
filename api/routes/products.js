const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const { default: mongoose } = require('mongoose');

router.get('/', (request, response, next) => {
    Product.find().exec()
        .then(documents => {
            console.log(documents);
            // we can also send a 404
            // if (documents.length == 0) {
            //     response.status(404).json({message: 'No entries found'});
            // }
            response.status(200).json(documents);
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ error: error });
        });
});

router.post('/', (request, response, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: request.body.name,
        price: request.body.price,
    });
    product.save()
        .then(result => {
            console.log(result);
            response.status(201).json({
                message: 'Handling POST requests to /products',
                createdProduct: result,
            });
        })
        .catch(error => { console.log(error) });
});

router.get('/:productId', (request, response, next) => {
    const id = request.params.productId;
    Product.findById(id).exec()
        .then(document => {
            console.log(document);
            if (document) {
                response.status(200).json(document);
            } else {
                response.status(404).json({ message: 'No valid entry found for provided ID' });
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ error: error });
        });
});

router.patch('/:productId', (request, response, next) => {
    const id = request.params.productId;
    const updateOperations = {};
    for (const operations of request.body) {
        updateOperations[operations.propName] = operations.value;
    }
    Product.updateMany({ _id: id }, { $set: updateOperations })
        .exec()
        .then(result => {
            console.log(result);
            response.status(200).json(result);
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ error: error });
        });
});


router.delete('/:productId', (request, response, next) => {
    const id = request.params.productId;
    Product.remove({ _id: id }).exec().then(result => {
        response.status(200).json(result);
    }).catch(error => {
        console.log(error);
        response.status(500).json({ error: error });
    });

});

module.exports = router;