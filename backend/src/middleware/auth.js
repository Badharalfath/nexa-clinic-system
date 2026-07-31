const jwt = require('jsonwebtoken');
const ApiResponse = require('./apiResponse');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.unauthorized(res, 'Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Invalid or expired token.');
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Authentication required.');
    }
    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'You do not have permission to access this resource.');
    }
    next();
  };
};

module.exports = { generateToken, verifyToken, authenticate, authorize };
