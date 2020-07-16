const express = require('express');
const router = express.Router();
const { getProducts, getProductWithId } = require('../controllers/product-controller');

router.get('/', getProducts);

router.get('/trek', getProducts);

router.get('/schwinn', getProducts);

router.get('/giant', getProducts);

router.get('/mountain', getProducts);

router.get('/cruiser', getProducts);

router.get('/road', getProducts);

router.get('/:id', getProductWithId);

module.exports = router;