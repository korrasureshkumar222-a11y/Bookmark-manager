const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      validate: {
        validator: function validateUrl(value) {
          try {
            new URL(value);
            return true;
          } catch (error) {
            return false;
          }
        },
        message: 'Please provide a valid URL',
      },
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    favourite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

bookmarkSchema.index({ title: 'text', url: 'text', description: 'text' });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
