const express = require('express');
const mongoose = require('mongoose');
const { body } = require('express-validator');
const {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
  getFolderBookmarks,
} = require('../controllers/folderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const validateFolder = [
  body('name').trim().notEmpty().withMessage('Folder name is required'),
];

const validateFolderId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid folder id' });
  }

  return next();
};

router.use(protect);

router.post('/', validateFolder, createFolder);
router.get('/', getFolders);
router.get('/:id/bookmarks', validateFolderId, getFolderBookmarks);
router.put('/:id', validateFolderId, validateFolder, updateFolder);
router.delete('/:id', validateFolderId, deleteFolder);

module.exports = router;
