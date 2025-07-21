const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middleware/auth');
const Upload = require('../models/Upload');

// 📁 Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🧾 Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// 📤 POST /api/notes/upload
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, branch, year, subject, description } = req.body;
    const filePath = `/uploads/${req.file.filename}`;

    const note = new Upload({
      title,
      branch,
      year,
      subject,
      description,
      file: filePath,
      uploadedBy: req.userId,
      uploadedAt: new Date(),
    });

    await note.save();

    res.status(201).json({
      message: 'Note uploaded successfully!',
      note,
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

module.exports = router;
