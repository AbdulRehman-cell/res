const mongoose = require('mongoose');

const GalleryImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    caption: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryImage', GalleryImageSchema);