const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'No authentication token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'User not found'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({ 
        error: 'Account inactive',
        message: 'Your account is not active'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(401).json({ 
        error: 'Account locked',
        message: 'Your account has been temporarily locked due to multiple failed login attempts'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please log in again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Invalid authentication token'
      });
    }
    
    return res.status(500).json({ 
      error: 'Authentication failed',
      message: 'Internal server error during authentication'
    });
  }
};

// Middleware to check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'User not authenticated'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
};

// Middleware to check if user is admin
const requireAdmin = requireRole('admin');

// Middleware to check if user is admin or reseller
const requireAdminOrReseller = requireRole(['admin', 'reseller']);

// Middleware to check if user can access client data
const canAccessClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const user = req.user;

    // Admins can access all clients
    if (user.role === 'admin') {
      return next();
    }

    // Resellers can access their own clients
    if (user.role === 'reseller') {
      const client = await User.findOne({
        where: { 
          id: clientId,
          parentId: user.id,
          role: 'client'
        }
      });
      
      if (client) {
        return next();
      }
    }

    // Clients can only access their own data
    if (user.role === 'client' && user.id === clientId) {
      return next();
    }

    return res.status(403).json({ 
      error: 'Access denied',
      message: 'You do not have permission to access this client data'
    });
  } catch (error) {
    logger.error('Client access check error:', error);
    return res.status(500).json({ 
      error: 'Access check failed',
      message: 'Internal server error during access verification'
    });
  }
};

// Middleware to check if user can access service data
const canAccessService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const user = req.user;

    // This would need to be implemented based on your service model
    // For now, we'll allow access based on user role
    if (user.role === 'admin') {
      return next();
    }

    if (user.role === 'reseller') {
      // Check if service belongs to reseller's client
      // Implementation depends on your service model structure
      return next();
    }

    if (user.role === 'client') {
      // Check if service belongs to the client
      // Implementation depends on your service model structure
      return next();
    }

    return res.status(403).json({ 
      error: 'Access denied',
      message: 'You do not have permission to access this service data'
    });
  } catch (error) {
    logger.error('Service access check error:', error);
    return res.status(500).json({ 
      error: 'Access check failed',
      message: 'Internal server error during access verification'
    });
  }
};

// Middleware to check if user can access ticket data
const canAccessTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const user = req.user;

    // This would need to be implemented based on your ticket model
    // For now, we'll allow access based on user role
    if (user.role === 'admin') {
      return next();
    }

    if (user.role === 'reseller') {
      // Check if ticket belongs to reseller's client
      // Implementation depends on your ticket model structure
      return next();
    }

    if (user.role === 'client') {
      // Check if ticket belongs to the client
      // Implementation depends on your ticket model structure
      return next();
    }

    return res.status(403).json({ 
      error: 'Access denied',
      message: 'You do not have permission to access this ticket data'
    });
  } catch (error) {
    logger.error('Ticket access check error:', error);
    return res.status(500).json({ 
      error: 'Access check failed',
      message: 'Internal server error during access verification'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      
      if (user && user.status === 'active' && !user.isLocked()) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Don't fail the request, just continue without user
    next();
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireAdminOrReseller,
  canAccessClient,
  canAccessService,
  canAccessTicket,
  optionalAuth
};