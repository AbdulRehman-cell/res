const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 10000,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      default: '',
      match: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|bmp|svg|)$/i,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', MenuItemSchema);