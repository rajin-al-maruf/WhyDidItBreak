const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    fingerprint: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["open", "resolved", "ignored"],
      default: "open",
      index: true,
    },
    occurrenceCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    firstSeen: {
      type: Date,
      default: Date.now,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Compound index: guarantees that for a given project, each fingerprint is unique!
issueSchema.index({ project: 1, fingerprint: 1 }, { unique: true });

module.exports = mongoose.model("Issue", issueSchema);
