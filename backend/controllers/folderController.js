const { validationResult } = require('express-validator');
const Folder = require('../models/Folder');
const Bookmark = require('../models/Bookmark');

const getPaginationData = (page, limit, total) => {
  const pageNumber = Number(page) > 0 ? Number(page) : 1;
  const limitNumber = Number(limit) > 0 ? Number(limit) : 10;
  const totalPages = Math.max(1, Math.ceil(total / limitNumber));

  return {
    page: pageNumber,
    limit: limitNumber,
    totalPages,
    total,
  };
};

const createFolder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const { name } = req.body;

    const folder = await Folder.create({
      name,
      owner: req.user._id,
    });

    return res.status(201).json({ folder });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You already have a folder with this name' });
    }

    return next(error);
  }
};

const getFolders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const total = await Folder.countDocuments({ owner: req.user._id });
    const pagination = getPaginationData(page, limit, total);

    const folders = await Folder.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit);

    const foldersWithCount = await Promise.all(
      folders.map(async (folder) => {
        const bookmarkCount = await Bookmark.countDocuments({
          owner: req.user._id,
          folder: folder._id,
        });

        return {
          ...folder.toObject(),
          bookmarkCount,
        };
      })
    );

    return res.status(200).json({
      data: foldersWithCount,
      total: pagination.total,
      page: pagination.page,
      totalPages: pagination.totalPages,
    });
  } catch (error) {
    return next(error);
  }
};

const updateFolder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    folder.name = req.body.name;
    await folder.save();

    return res.status(200).json({ folder });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You already have a folder with this name' });
    }

    return next(error);
  }
};

const deleteFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    await Bookmark.updateMany(
      { owner: req.user._id, folder: folder._id },
      { $set: { folder: null } }
    );

    await folder.deleteOne();

    return res.status(200).json({
      message: 'Folder deleted successfully',
      folderId: req.params.id,
    });
  } catch (error) {
    return next(error);
  }
};

const getFolderBookmarks = async (req, res, next) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const total = await Bookmark.countDocuments({
      owner: req.user._id,
      folder: folder._id,
    });

    const pagination = getPaginationData(page, limit, total);

    const bookmarks = await Bookmark.find({
      owner: req.user._id,
      folder: folder._id,
    })
      .sort({ createdAt: -1 })
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit);

    return res.status(200).json({
      data: bookmarks,
      total: pagination.total,
      page: pagination.page,
      totalPages: pagination.totalPages,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
  getFolderBookmarks,
};
