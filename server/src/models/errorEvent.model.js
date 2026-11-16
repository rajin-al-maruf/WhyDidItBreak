const mongoose = require('mongoose');

const errorEventSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    stack: {
      type: String,
      trim: true,
      maxlength: 10000,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    environment: {
      type: String,
      default: 'development',
      trim: true,
      maxlength: 50,
    },
    url: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    browser: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('ErrorEvent', errorEventSchema);