const express = require('express');
const { toggleFavorite, getMyFavorites, checkIsFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getMyFavorites);
router.post('/:propertyId', toggleFavorite);
router.get('/check/:propertyId', checkIsFavorite);

module.exports = router;
