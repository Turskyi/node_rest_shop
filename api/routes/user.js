const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { request, response } = require('../../app');

router.post('/signup', (request, response, next) => {
    User.find({ email: request.body.email, })
        .exec()
        .then(user => {
            if (user.lenth >= 1) {
                return response.status(409).json({
                    message: 'Mail existst',
                });
            } else {
                bcrypt.hash(
                    request.body.password,
                    //salting (number of rounds to hash the password)
                    10,
                    (error, hash) => {
                        if (error) {
                            return response.status(500).json({
                                error: error,
                            })
                        } else {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                email: request.body.email,
                                password: hash,
                            });
                            user.save()
                                .then(result => {
                                    console.log(result);
                                    response.status(200).json({
                                        message: 'User created',
                                    })
                                })
                                .catch(error => {
                                    console.log(error);
                                    response.status(500).json({ error: error });
                                });
                        }
                    }
                )
            }
        });
});

router.post('/login', (request, response, next) => {
    User.find({ email: request.body.email })
        .exec()
        .then(users => {
            if (users.lenth < 1) {
                return response.status(401).json({
                    message: 'Auth failed',
                });
            }
            bcrypt.compare(request.body.password, users[0].password, (error, result) => {
                if (error) {
                    return response.status(401).json({
                        message: 'Auth failed',
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: users[0].email,
                            userId: users[0]._id,
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return response.status(200).json({
                        message: 'Auth successful',
                        token: token,
                    });
                }
                return response.status(401).json({
                    message: 'Auth failed',
                });
            });
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ error: error });
        });
});

router.delete('/:userId', (request, response, next) => {
    User.remove({ _id: request.body.userId }).exec()
        .then(result => {
            result.status(200).json({
                message: 'User deleted',
            });
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ error: error });
        });
});

module.exports = router;