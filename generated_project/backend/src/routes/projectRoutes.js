const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', ProjectController.createProject);
router.get('/', ProjectController.getProjects);
router.get('/:id', ProjectController.getProjectById);
router.post('/:id/invitations', ProjectController.inviteMember);

module.exports = router;