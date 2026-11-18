const Project = require("../models/project.model");
const ErrorEvent = require("../models/errorEvent.model");
const Issue = require("../models/issue.model");
const { generateFingerprint } = require("../utils/fingerprint");

const ingestErrorEvent = async (req, res) => {
  try {
    const {
      ingestionKey,
      message,
      stack,
      timestamp,
      environment,
      url,
      browser,
    } = req.body;

    if (typeof ingestionKey !== "string" || !ingestionKey.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid ingestionKey is required",
      });
    }

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "An error message is required",
      });
    }

    const project = await Project.findOne({
      ingestionKey: ingestionKey.trim(),
    }).select("+ingestionKey");

    if (!project) {
      return res.status(401).json({
        success: false,
        message: "Invalid or inactive ingestion key",
      });
    }

    const fingerprint = generateFingerprint(message, stack);

    const issue = await Issue.findOneAndUpdate(
      { project: project._id, fingerprint },
      {
        $inc: { occurrenceCount: 1 },
        $set: { lastSeen: new Date() },
        $setOnInsert: {
          title: message.slice(0, 200),
          firstSeen: new Date(),
          status: "open",
        },
      },
      { upsert: true, new: true }, // upsert = update if exists, insert if new
    );

    const errorEvent = await ErrorEvent.create({
      project: project._id,
      issue: issue._id,
      message: message.trim(),
      stack: typeof stack === "string" ? stack.trim() : undefined,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      environment:
        typeof environment === "string" ? environment.trim() : "development",
      url: typeof url === "string" ? url.trim() : undefined,
      browser: typeof browser === "string" ? browser.trim() : undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Error event captured successfully.",
      eventId: errorEvent._id,
      ssueId: issue._id,
      occurrenceCount: issue.occurrenceCount,
    });
  } catch (error) {
    console.error("Error ingestion failed:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while capturing event",
    });
  }
};

module.exports = { ingestErrorEvent };

