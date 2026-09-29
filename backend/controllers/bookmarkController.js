const { validationResult } = require('express-validator');
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

const getPaginatedBookmarks = async (req, query, baseFilter = {}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const filter = { owner: req.user._id, ...baseFilter };

  const total = await Bookmark.countDocuments(filter);
  const pagination = getPaginationData(page, limit, total);

  const bookmarks = await Bookmark.find(filter)
    .sort({ createdAt: -1 })
    .skip((pagination.page - 1) * pagination.limit)
    .limit(pagination.limit)
    .populate('folder', 'name');

  return {
    data: bookmarks,
    total: pagination.total,
    page: pagination.page,
    totalPages: pagination.totalPages,
  };
};

const createBookmark = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const { title, url, description = '', tags = [], folder = null, favourite = false } = req.body;

    const bookmark = await Bookmark.create({
      title,
      url,
      description,
      tags,
      folder,
      favourite,
      owner: req.user._id,
    });

    return res.status(201).json({ bookmark });
  } catch (error) {
    return next(error);
  }
};

const getBookmarks = async (req, res, next) => {
  try {
    const response = await getPaginatedBookmarks(req, req.query);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const getBookmarkById = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      owner: req.user._id,
    }).populate('folder', 'name');

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    return res.status(200).json({ bookmark });
  } catch (error) {
    return next(error);
  }
};

const updateBookmark = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    const allowedFields = ['title', 'url', 'description', 'tags', 'folder', 'favourite'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        bookmark[field] = req.body[field];
      }
    });

    await bookmark.save();

    return res.status(200).json({ bookmark });
  } catch (error) {
    return next(error);
  }
};

const deleteBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    await bookmark.deleteOne();

    return res.status(200).json({
      message: 'Bookmark deleted successfully',
      bookmarkId: req.params.id,
    });
  } catch (error) {
    return next(error);
  }
};

const searchBookmarks = async (req, res, next) => {
  try {
    const searchTerm = (req.query.q || '').trim();

    if (!searchTerm) {
      const response = await getPaginatedBookmarks(req, req.query);
      return res.status(200).json(response);
    }

    const query = {
      owner: req.user._id,
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { url: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
    };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const total = await Bookmark.countDocuments(query);
    const pagination = getPaginationData(page, limit, total);

    const bookmarks = await Bookmark.find(query)
      .sort({ createdAt: -1 })
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .populate('folder', 'name');

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

const getBookmarksByTag = async (req, res, next) => {
  try {
    const { tag } = req.params;
    const response = await getPaginatedBookmarks(req, req.query, {
      tags: { $in: [tag] },
    });

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const toggleFavourite = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    bookmark.favourite = !bookmark.favourite;
    await bookmark.save();

    return res.status(200).json({ bookmark });
  } catch (error) {
    return next(error);
  }
};

const getFavourites = async (req, res, next) => {
  try {
    const response = await getPaginatedBookmarks(req, req.query, {
      favourite: true,
    });

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const getRecentBookmarks = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const bookmarks = await Bookmark.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('folder', 'name');

    return res.status(200).json({
      data: bookmarks,
      limit,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
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
};
