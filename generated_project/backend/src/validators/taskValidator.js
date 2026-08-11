const { body, validationResult } = require('express-validator');

const validateTaskCreate = [
  body('title').notEmpty().withMessage('Task title is required').isString().trim(),
  body('description').optional().isString().trim(),
  body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Status must be TODO, IN_PROGRESS, or DONE'),
  body('dueDate').optional().isISO8601().toDate().withMessage('Due date must be a valid ISO date'),
  body('assigneeId').optional().isUUID().withMessage('Assignee ID must be a valid UUID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateTaskUpdate = [
  body('title').optional().notEmpty().withMessage('Task title cannot be empty').isString().trim(),
  body('description').optional().isString().trim(),
  body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Status must be TODO, IN_PROGRESS, or DONE'),
  body('dueDate').optional().isISO8601().toDate().withMessage('Due date must be a valid ISO date'),
  body('assigneeId').optional().isUUID().withMessage('Assignee ID must be a valid UUID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateTaskCreate,
  validateTaskUpdate
};