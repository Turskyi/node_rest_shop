const express = require('express');
const router = express.Router();

const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './uploads/');
    },
    filename: function (request, file, callback) {
        callback(null, new Date().toISOString() + file.originalname);
    },
});

const fileFilter = (request, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        // reject a file
        callback(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        // 1024 * 1024 (1 MB)
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
});

router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;