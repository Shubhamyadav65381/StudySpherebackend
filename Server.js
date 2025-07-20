const express = require('express');
const http = require('http'); // ✅ NEW
const { Server } = require('socket.io'); // ✅ NEW
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ Use http server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // ✅ Your frontend origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ✅ Basic socket setup
io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
    console.log(`📦 Joined group ${groupId}`);
  });

  socket.on('sendMessage', ({ groupId, message }) => {
    console.log(`💬 Message to ${groupId}:`, message);
    socket.to(groupId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// ✅ Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/user', require('./routes/dashboardRoutes'));
app.use('/api/planner', require('./routes/planner'));
app.use('/api/ai', require('./routes/planner'));
app.use('/api/groups', require('./routes/groupRoutes')); // ✅ Must exist!

// ✅ DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Start the http server (not app.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
