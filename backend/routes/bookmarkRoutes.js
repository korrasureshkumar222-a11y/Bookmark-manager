const express = require('express');
const mongoose = require('mongoose');
const { body } = require('express-validator');
const {
  createBookmark,
  getBookmarks,
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
  searchBookmarks,
  getBookmarksByTag,
  toggleFavourite,
  getFavourites,
  getRecentBookmarks,
} = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const validateBookmark = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .isURL({ require_protocol: true })
    .withMessage('Please provide a valid URL'),
];

const validateBookmarkId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid bookmark id' });
  }

  return next();
};

router.use(protect);

router.post('/', validateBookmark, createBookmark);
router.get('/', getBookmarks);
router.get('/search', searchBookmarks);
router.get('/tag/:tag', getBookmarksByTag);
router.get('/favourites', getFavourites);
router.get('/recent', getRecentBookmarks);
router.patch('/:id/favourite', validateBookmarkId, toggleFavourite);
router.get('/:id', validateBookmarkId, getBookmarkById);
router.put('/:id', validateBookmarkId, validateBookmark, updateBookmark);
router.delete('/:id', validateBookmarkId, deleteBookmark);

module.exports = router;
