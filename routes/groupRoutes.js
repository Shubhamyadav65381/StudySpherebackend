const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { verifyToken } = require('../middleware/auth');
const Group = require('../models/Group');
const Message = require('../models/Message');
const User = require('../models/User');

// ✅ Create group
router.post('/create', verifyToken, async (req, res) => {
  const { name, memberIds = [] } = req.body;

  try {
    const group = new Group({
      name,
      members: [...memberIds, req.user.id],
      createdBy: req.user.id,
    });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    console.error('❌ Error creating group:', err.message);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// ✅ Get all groups for logged-in user
router.get('/my-groups', verifyToken, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).populate('members', 'name email');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Could not load groups' });
  }
});

// ✅ Send a message to a group
router.post('/message', verifyToken, async (req, res) => {
  const { groupId, content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ error: 'Invalid group ID' });
  }

  try {
    const message = new Message({
      group: groupId,
      sender: req.user.id,
      content,
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error('❌ Error sending message:', err.message);
    res.status(500).json({ error: 'Message send failed' });
  }
});

// ✅ Get all messages in a group
router.get('/messages/:groupId', verifyToken, async (req, res) => {
  const { groupId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ error: 'Invalid group ID' });
  }

  try {
    const messages = await Message.find({ group: groupId })
      .populate('sender', 'name')
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error('❌ Error fetching messages:', err.message);
    res.status(500).json({ error: 'Could not fetch messages' });
  }
});
// ✅ Get single group by ID
router.get('/:groupId', verifyToken, async (req, res) => {
  const { groupId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ error: 'Invalid group ID' });
  }

  try {
    const group = await Group.findById(groupId).populate('members', 'name email');
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (err) {
    console.error('❌ Error getting group:', err.message);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});


module.exports = router;
