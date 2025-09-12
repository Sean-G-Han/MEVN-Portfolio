require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const projectRoutes = require('./routes/ProjectRoutes');
const proficiencyRoutes = require('./routes/ProficiencyRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);
app.use('/api/proficiencies', proficiencyRoutes);

const PORT = process.env.PORT;
const CONNECTION_URL = process.env.MONGO_URI;

if (!CONNECTION_URL) {
    console.error("URL NOT FOUND");
    process.exit(1);
}

mongoose.connect(CONNECTION_URL, {
  dbName: 'PortfolioDB',
})
.then(() => {
  console.log('MongoDB connected successfully');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  app.listen(PORT, () => {
    console.log(`Server running without MongoDB on port ${PORT}`);
  });
});

const db = mongoose.connection;
db.on('error', (err) => console.error('Connection Error:', err));
db.once('open', () => console.log('Connection Success'));

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
