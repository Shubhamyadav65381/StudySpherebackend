const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Allow both local & deployed frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://study-sphere-tau.vercel.app',
];

// ✅ CORS for REST API
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ✅ Socket events
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
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/user', require('./routes/dashboardRoutes'));
app.use('/api/planner', require('./routes/planner'));
app.use('/api/ai', require('./routes/planner')); // ✅ if shared or you can separate AI routes
app.use('/api/groups', require('./routes/groupRoutes'));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
