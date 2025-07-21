const jwt = require('jsonwebtoken');

// ✅ Middleware to verify JWT token from Authorization header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // 🔒 Check if token is provided in proper format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // ✅ Verify token using secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user info to request for further access
    req.user = decoded;       // Full decoded token (can include name, email, etc.)
    req.userId = decoded.id;  // Common usage shortcut

    next(); // ✅ Proceed to next middleware/route
  } catch (err) {
    console.error('❌ JWT Error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken };
