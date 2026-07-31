const { User } = require('../models');
const { generateToken } = require('../middleware/auth');
const ApiResponse = require('../utils/apiResponse');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return ApiResponse.unauthorized(res, 'Invalid username or password');
    }

    // Check if active
    if (!user.isActive) {
      return ApiResponse.forbidden(res, 'Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return ApiResponse.unauthorized(res, 'Invalid username or password');
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    });

    return ApiResponse.success(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return ApiResponse.error(res, 'Login failed');
  }
};

const logout = async (req, res) => {
  // JWT is stateless — client discards the token
  return ApiResponse.success(res, null, 'Logout successful');
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }
    return ApiResponse.success(res, user);
  } catch (error) {
    console.error('Get me error:', error);
    return ApiResponse.error(res, 'Failed to get user');
  }
};

module.exports = { login, logout, getMe };
