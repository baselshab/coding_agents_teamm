const ProjectModel = require('../models/projectModel');

const verifyProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.id || req.params.projectId;
    const userId = req.user.id;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const membership = await ProjectModel.isMember(projectId, userId);
    if (!membership) {
      return res.status(403).json({ error: 'Access denied: You are not a member of this project' });
    }

    req.projectMembership = membership;
    next();
  } catch (err) {
    console.error('Project Auth Error:', err);
    res.status(500).json({ error: 'Internal server error during authorization' });
  }
};

const verifyProjectOwnerOrManager = async (req, res, next) => {
  try {
    const membership = req.projectMembership;
    if (!membership || (membership.role !== 'owner' && membership.role !== 'manager')) {
      return res.status(403).json({ error: 'Access denied: Only project owners or managers can perform this action' });
    }
    next();
  } catch (err) {
    console.error('Project Owner/Manager Auth Error:', err);
    res.status(500).json({ error: 'Internal server error during authorization' });
  }
};

module.exports = {
  verifyProjectAccess,
  verifyProjectOwnerOrManager
};
