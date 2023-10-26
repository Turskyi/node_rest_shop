const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (request, response, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(documents => {
            response.status(200).json({
                count: documents.length,
                orders: documents.map(document => {
                    return {
                        _id: document._id,
                        product: document.product,
                        quantity: document.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + document._id,
                        }
                    }
                }),
            });
        }).catch(error => {
            response.status(500).json({
                error: error,
            });
        });
}

exports.orders_create_order = (request, response, next) => {
    Product.findById(request.body.productId)
        .then(product => {
            if (!product) {
                return response.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: request.body.quantity,
                product: request.body.productId
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            response.status(201).json({
                message: "Order stored",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({
                error: err
            });
        });
}

exports.orders_get_order = (request, response, next) => {
    Order.findById(request.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
            response.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/'
                }
            });
        }).catch(error => {
            response.status(500).json({
                error: error,
            });
        });
}

exports.orders_delete_order = (request, response, next) => {
    Order.remove({ _id: request.params.orderId })
        .exec()
        .then(order => {
            if (!order) {
                return response.status(404).json({
                    message: 'Order not found',
                });
            }
            response.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: {
                        productId: 'ID',
                        quantity: 'Number',
                    }
                }
            });
        }).catch();
}