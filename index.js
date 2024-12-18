const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Schema for the About Me text
const aboutTextSchema = new mongoose.Schema({
  paragraph1: String,
  paragraph2: String,
  paragraph3: String,
});

// Model
const AboutText = mongoose.model('AboutText', aboutTextSchema);

// Routes
// Get the About Me text
app.get('/api/about', async (req, res) => {
  try {
    const aboutText = await AboutText.findOne();
    res.json(aboutText);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching About Me text' });
  }
});

// Update the About Me text (Admin only)
app.put('/api/about', async (req, res) => {
  try {
    const { paragraph1, paragraph2, paragraph3 } = req.body;
    const updatedText = await AboutText.findOneAndUpdate(
      {},
      { paragraph1, paragraph2, paragraph3 },
      { new: true, upsert: true } // Create if doesn't exist
    );
    res.json(updatedText);
  } catch (err) {
    res.status(500).json({ error: 'Error updating About Me text' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
