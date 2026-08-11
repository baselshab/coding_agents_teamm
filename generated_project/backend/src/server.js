const express = require('express');
const cors = require('cors');
require('dotenv').config();

const projectRoutes = require('./routes/projectRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/projects', projectRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'CollabTask Backend' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;