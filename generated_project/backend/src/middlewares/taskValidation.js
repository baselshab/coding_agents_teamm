const validateTaskCreation = (req, res, next) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required.' });
  }

  const { status } = req.body;
  const validStatuses = ['To Do', 'In Progress', 'Done'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status. Allowed values are 'To Do', 'In Progress', 'Done'." });
  }

  next();
};

const validateTaskUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['To Do', 'In Progress', 'Done'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status. Allowed values are 'To Do', 'In Progress', 'Done'." });
  }

  next();
};

module.exports = {
  validateTaskCreation,
  validateTaskUpdate
};
