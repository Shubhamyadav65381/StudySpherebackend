const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth'); // ✅ ensure correct import path
const Upload = require('../models/Upload');
const Summary = require('../models/Summary');

// 🧠 GET /api/user/stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const uploadsCount = await Upload.countDocuments({ uploadedBy: userId });
    const summariesCount = await Summary.countDocuments({ userId });
    const downloadsCount = 0; // 🔄 update later if tracking downloads

    res.json({ uploads: uploadsCount, summaries: summariesCount, downloads: downloadsCount });
  } catch (err) {
    console.error('❌ Stats error:', err.message);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// 📄 GET /api/user/uploads
router.get('/uploads', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const allUploads = await Upload.find({ uploadedBy: userId })
      .sort({ createdAt: -1 });

    res.json(allUploads);
  } catch (err) {
    console.error('❌ Uploads error:', err.message);
    res.status(500).json({ message: 'Error fetching uploads' });
  }
});

// 🧠 GET /api/user/ai-history
router.get('/ai-history', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const history = await Summary.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(history);
  } catch (err) {
    console.error('❌ AI history error:', err.message);
    res.status(500).json({ message: 'Error fetching AI history' });
  }
});

module.exports = router;
