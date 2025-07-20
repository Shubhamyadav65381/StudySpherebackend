const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const auth = require('./middleware/auth');
const { verifyToken } = require('../middleware/auth');
const Upload = require('../models/Upload');
// console.log('auth module:', auth);
// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// POST /api/notes/upload
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    console.log('📥 Upload route hit');
    console.log('📨 Received body:', req.body);
    console.log('📄 Received file:', req.file);
    console.log('🧪 User ID:', req.userId);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized: No user ID' });
    }

    const { title, branch, year, subject, description } = req.body;
    const filePath = `/uploads/${req.file.filename}`;

    const newNote = new Upload({
      title,
      branch,
      year,
      subject,
      description,
      file: filePath,
      uploadedBy: req.userId,
      uploadedAt: new Date()
    });

    await newNote.save();

    console.log('✅ Note saved successfully:', newNote);
    res.status(201).json({ message: 'Note uploaded successfully!', note: newNote });

  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

module.exports = router;
