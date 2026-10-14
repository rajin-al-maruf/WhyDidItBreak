const Project = require('../models/project.model');
const mongoose = require('mongoose');

const createProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
      return res.status(400).json({success: false, message: 'Project name must contain 1 to 100 characters'})
    }

    const project = await Project.create({name: name.trim(), owner: req.user._id,})

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    return res.status(500).json({success: false, message: 'Internal server error'})
  }
}

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({owner: req.user._id,}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      projects,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({success: false, message: 'Invalid project ID'})
    }

    const project = await Project.findOne({_id: id, owner: req.user._id})

    if (!project) {
      return res.status(404).json({success: false, message: 'Project not found'})
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({success: false, message: 'Invalid project ID'});
    }

    if (typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
      return res.status(400).json({success: false, message: 'Project name must contain 1 to 100 characters'});
    }

    const project = await Project.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { $set: { name: name.trim() } },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({success: false, message: 'Project not found'})
    }

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      project,
    });
  } catch (error) {
    return res.status(500).json({success: false, message: 'Internal server error'})
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({success: false, message: 'Invalid project ID.'})
    }

    const project = await Project.findOneAndDelete({_id: id, owner: req.user._id});

    if (!project) {
      return res.status(404).json({success: false, message: 'Project not found.'})
    }

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({success: false, message: 'Internal server error.'});
  }
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };