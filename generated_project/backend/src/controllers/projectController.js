const crypto = require('crypto');
const ProjectModel = require('../models/projectModel');

const ProjectController = {
  async createProject(req, res) {
    try {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Project title is required' });
      }

      const project = await ProjectModel.createProject(title, description, req.user.userId);
      return res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
      console.error('Error creating project:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getProjects(req, res) {
    try {
      const projects = await ProjectModel.findByUserId(req.user.userId);
      return res.status(200).json({ projects });
    } catch (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getProjectById(req, res) {
    try {
      const projectId = req.params.id;
      const project = await ProjectModel.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const role = await ProjectModel.getMemberRole(projectId, req.user.userId);
      if (!role) {
        return res.status(403).json({ error: 'Access denied to this project' });
      }

      return res.status(200).json({ project, role });
    } catch (error) {
      console.error('Error fetching project details:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async inviteMember(req, res) {
    try {
      const projectId = req.params.id;
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required for invitation' });
      }

      const role = await ProjectModel.getMemberRole(projectId, req.user.userId);
      if (role !== 'Project Manager') {
        return res.status(403).json({ error: 'Only Project Managers can invite members' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const invitation = await ProjectModel.addInvitation(projectId, email, token, expiresAt);

      // In production, trigger email sending service here using the token
      return res.status(201).json({
        message: 'Invitation sent successfully',
        invitation: {
          id: invitation.id,
          email: invitation.email,
          projectId: invitation.project_id,
          status: invitation.status,
          expiresAt: invitation.expires_at,
          inviteToken: token // Included for testing purposes
        }
      });
    } catch (error) {
      console.error('Error inviting member:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = ProjectController;