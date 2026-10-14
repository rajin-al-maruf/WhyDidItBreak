const express = require('express');
const { createProject, getProjects, getProject, updateProject, deleteProject, getIngestionKey, rotateIngestionKey} = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();
//fr2
router.post('/', authMiddleware, createProject);
router.get('/', authMiddleware, getProjects);
router.get('/:id', authMiddleware, getProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);
//fr3
router.get('/:id/ingestion-key', authMiddleware, getIngestionKey);
router.post('/:id/ingestion-key/rotate', authMiddleware, rotateIngestionKey);

module.exports = router;