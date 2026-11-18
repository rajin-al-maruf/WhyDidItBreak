const Issue = require('../models/issue.model');
const Project = require('../models/project.model');
const ErrorEvent = require('../models/errorEvent.model');
const mongoose = require('mongoose');

const getProjectIssues = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.isObjectIdOrHexString(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format.',
      });
    }

    const project = await Project.findOne({_id: projectId, owner: req.user._id,})

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or unauthorized.',
      });
    }

    const issues = await Issue.find({ project: projectId }).sort({lastSeen: -1})

    return res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    })
  } catch (error) {
    console.error('Failed to get project issues:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching issues.',
    });
  }
};

const getIssueDetails = async (req, res) => {
  try {
    const { projectId, issueId } = req.params;

    if (!mongoose.isObjectIdOrHexString(projectId) || !mongoose.isObjectIdOrHexString(issueId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project or issue ID format.',
      });
    }

    const project = await Project.findOne({_id: projectId,owner: req.user._id,});

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or unauthorized.',
      });
    }

    const issue = await Issue.findOne({_id: issueId, project: projectId});

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found.',
      });
    }

    const latestEvent = await ErrorEvent.findOne({issue: issueId}).sort({ timestamp: -1 });

    const recentEvents = await ErrorEvent.find({ issue: issueId}).sort({ timestamp: -1 }).limit(10)

    return res.status(200).json({
      success: true,
      issue,
      latestEvent,
      recentEvents,
    });
  } catch (error) {
    console.error('Failed to get issue details:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching issue details.',
    });
  }
};

module.exports = { getProjectIssues , getIssueDetails}