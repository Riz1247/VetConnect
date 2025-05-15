const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByCategory
} = require('../controllers/productController');

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/category/:category').get(getProductsByCategory);

module.exports = router;