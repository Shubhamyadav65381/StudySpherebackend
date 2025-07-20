const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');  // ✅ Fixed line
const Upload = require('../models/Upload');
const Summary = require('../models/Summary');

// 🧠 GET /api/user/stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const uploads = await Upload.countDocuments({ uploadedBy: userId });
    const summaries = await Summary.countDocuments({ userId });
    const downloads = 0;

    res.json({ uploads, summaries, downloads });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// 📄 GET /api/user/uploads
// 📄 GET /api/user/uploads
router.get('/uploads', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const allUploads = await Upload.find({ uploadedBy: userId })
      .sort({ createdAt: -1 }); // removed `.limit(5)`
    res.json(allUploads);
  } catch (err) {
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
    res.status(500).json({ message: 'Error fetching AI history' });
  }
});

module.exports = router;
