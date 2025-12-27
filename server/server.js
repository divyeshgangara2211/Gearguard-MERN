const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/teams', require('./routes/team'));
app.use('/api/requests', require('./routes/request'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ message: '✅ Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
