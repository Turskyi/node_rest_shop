const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all = (request, response, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(documents => {
            const documentsResponse = {
                count: documents.length,
                products: documents.map(document => {
                    return {
                        name: document.name,
                        price: document.price,
                        image: document.image,
                        _id: document._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + document._id,
                        }
                    }
                }),
            };

            response.status(200).json(documentsResponse);
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ error: error });
        });
}

exports.products_create_product = (request, response, next) => {
    console.log(request.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: request.body.name,
        price: request.body.price,
        image: request.file.path,
    });
    product.save()
        .then(result => {
            console.log(result);
            response.status(201).json({
                message: 'Handling POST requests to /products',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id,
                    }
                },
            });
        })
        .catch(error => { console.log(error) });
}

exports.products_get_product = (request, response, next) => {
    const id = request.params.productId;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(document => {
            console.log(document);
            if (document) {
                response.status(200).json({
                    product: document,
                    request: {
                        type: 'GET',
                        description: 'GET_ALL_PRODUCTS',
                        url: 'http://localhost:3000/products/',
                    }
                });
            } else {
                response.status(404).json({ message: 'No valid entry found for provided ID' });
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ error: error });
        });
}

exports.products_update_product = (request, response, next) => {
    const id = request.params.productId;
    const updateOperations = {};
    for (const operations of request.body) {
        updateOperations[operations.propName] = operations.value;
    }
    Product.updateMany({ _id: id }, { $set: updateOperations })
        .exec()
        .then(result => {
            console.log(result);
            response.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id,
                }
            });
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ error: error });
        });
}

exports.products_delete_product = (request, response, next) => {
    const id = request.params.productId;
    Product.remove({ _id: id }).exec().then(result => {
        response.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: { name: 'String', price: 'Number' }
            }
        });
    }).catch(error => {
        console.log(error);
        response.status(500).json({ error: error });
    });

}