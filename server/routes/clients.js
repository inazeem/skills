const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');

const User = require('../models/User');
const HostingService = require('../models/HostingService');
const Invoice = require('../models/Invoice');
const Ticket = require('../models/Ticket');
const { authenticateToken, requireAdminOrReseller, canAccessClient } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Validation rules
const createClientValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-50 characters and contain only letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .isLength({ min: 1, max: 100 })
    .withMessage('First name is required'),
  body('lastName')
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name is required'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Address is too long'),
  body('city')
    .optional()
    .isLength({ max: 100 })
    .withMessage('City name is too long'),
  body('state')
    .optional()
    .isLength({ max: 100 })
    .withMessage('State name is too long'),
  body('country')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country name is too long'),
  body('postalCode')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Postal code is too long')
];

const updateClientValidation = [
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be 1-100 characters'),
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be 1-100 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Address is too long'),
  body('city')
    .optional()
    .isLength({ max: 100 })
    .withMessage('City name is too long'),
  body('state')
    .optional()
    .isLength({ max: 100 })
    .withMessage('State name is too long'),
  body('country')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country name is too long'),
  body('postalCode')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Postal code is too long'),
  body('timezone')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Timezone is too long'),
  body('language')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Language code is too long'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Invalid status')
];

// Get all clients (with pagination and filtering)
router.get('/', authenticateToken, requireAdminOrReseller, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isLength({ max: 100 }).withMessage('Search term is too long'),
  query('status').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status'),
  query('role').optional().isIn(['client', 'reseller']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        errors: errors.array()
      });
    }

    const { page = 1, limit = 20, search, status, role } = req.query;
    const offset = (page - 1) * limit;
    const user = req.user;

    // Build where clause
    const whereClause = {};
    
    // Resellers can only see their own clients
    if (user.role === 'reseller') {
      whereClause.parentId = user.id;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (role) {
      whereClause.role = role;
    }

    const { count, rows: clients } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password', 'twoFactorSecret', 'emailVerificationToken', 'passwordResetToken'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      clients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    logger.error('Get clients error:', error);
    res.status(500).json({
      error: 'Failed to retrieve clients',
      message: 'An error occurred while retrieving client data'
    });
  }
});

// Get single client
router.get('/:clientId', authenticateToken, requireAdminOrReseller, canAccessClient, async (req, res) => {
  try {
    const { clientId } = req.params;

    const client = await User.findByPk(clientId, {
      attributes: { exclude: ['password', 'twoFactorSecret', 'emailVerificationToken', 'passwordResetToken'] }
    });

    if (!client) {
      return res.status(404).json({
        error: 'Client not found',
        message: 'The specified client does not exist'
      });
    }

    res.json({ client });

  } catch (error) {
    logger.error('Get client error:', error);
    res.status(500).json({
      error: 'Failed to retrieve client',
      message: 'An error occurred while retrieving client data'
    });
  }
});

// Create new client
router.post('/', authenticateToken, requireAdminOrReseller, createClientValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = req.user;
    const clientData = {
      ...req.body,
      role: 'client',
      parentId: user.role === 'reseller' ? user.id : null
    };

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: clientData.email }, { username: clientData.username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'A user with this email or username already exists'
      });
    }

    // Create new client
    const client = await User.create(clientData);

    res.status(201).json({
      message: 'Client created successfully',
      client: {
        id: client.id,
        username: client.username,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        role: client.role,
        status: client.status,
        createdAt: client.createdAt
      }
    });

  } catch (error) {
    logger.error('Create client error:', error);
    res.status(500).json({
      error: 'Failed to create client',
      message: 'An error occurred while creating the client'
    });
  }
});

// Update client
router.put('/:clientId', authenticateToken, requireAdminOrReseller, canAccessClient, updateClientValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        errors: errors.array()
      });
    }

    const { clientId } = req.params;
    const updateData = req.body;

    const client = await User.findByPk(clientId);
    if (!client) {
      return res.status(404).json({
        error: 'Client not found',
        message: 'The specified client does not exist'
      });
    }

    // Update client
    await client.update(updateData);

    res.json({
      message: 'Client updated successfully',
      client: {
        id: client.id,
        username: client.username,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        role: client.role,
        status: client.status,
        updatedAt: client.updatedAt
      }
    });

  } catch (error) {
    logger.error('Update client error:', error);
    res.status(500).json({
      error: 'Failed to update client',
      message: 'An error occurred while updating the client'
    });
  }
});

// Delete client
router.delete('/:clientId', authenticateToken, requireAdminOrReseller, canAccessClient, async (req, res) => {
  try {
    const { clientId } = req.params;

    const client = await User.findByPk(clientId);
    if (!client) {
      return res.status(404).json({
        error: 'Client not found',
        message: 'The specified client does not exist'
      });
    }

    // Check if client has active services
    const activeServices = await HostingService.count({
      where: { clientId, status: 'active' }
    });

    if (activeServices > 0) {
      return res.status(400).json({
        error: 'Cannot delete client',
        message: 'Client has active hosting services. Please cancel all services before deleting the client.'
      });
    }

    // Check if client has unpaid invoices
    const unpaidInvoices = await Invoice.count({
      where: { 
        clientId, 
        status: { [Op.in]: ['sent', 'overdue'] }
      }
    });

    if (unpaidInvoices > 0) {
      return res.status(400).json({
        error: 'Cannot delete client',
        message: 'Client has unpaid invoices. Please resolve all outstanding payments before deleting the client.'
      });
    }

    // Soft delete by setting status to inactive
    await client.update({ status: 'inactive' });

    res.json({
      message: 'Client deleted successfully'
    });

  } catch (error) {
    logger.error('Delete client error:', error);
    res.status(500).json({
      error: 'Failed to delete client',
      message: 'An error occurred while deleting the client'
    });
  }
});

// Get client services
router.get('/:clientId/services', authenticateToken, requireAdminOrReseller, canAccessClient, async (req, res) => {
  try {
    const { clientId } = req.params;

    const services = await HostingService.findAll({
      where: { clientId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ services });

  } catch (error) {
    logger.error('Get client services error:', error);
    res.status(500).json({
      error: 'Failed to retrieve client services',
      message: 'An error occurred while retrieving client services'
    });
  }
});

// Get client invoices
router.get('/:clientId/invoices', authenticateToken, requireAdminOrReseller, canAccessClient, async (req, res) => {
  try {
    const { clientId } = req.params;
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { clientId };
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where: whereClause,
      order: [['issueDate', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    logger.error('Get client invoices error:', error);
    res.status(500).json({
      error: 'Failed to retrieve client invoices',
      message: 'An error occurred while retrieving client invoices'
    });
  }
});

// Get client tickets
router.get('/:clientId/tickets', authenticateToken, requireAdminOrReseller, canAccessClient, async (req, res) => {
  try {
    const { clientId } = req.params;
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { clientId };
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: tickets } = await Ticket.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    logger.error('Get client tickets error:', error);
    res.status(500).json({
      error: 'Failed to retrieve client tickets',
      message: 'An error occurred while retrieving client tickets'
    });
  }
});

// Get client statistics
router.get('/:clientId/stats', authenticateToken, requireAdminOrReseller, canAccessClient, async (req, res) => {
  try {
    const { clientId } = req.params;

    // Get service statistics
    const totalServices = await HostingService.count({ where: { clientId } });
    const activeServices = await HostingService.count({ where: { clientId, status: 'active' } });
    const suspendedServices = await HostingService.count({ where: { clientId, status: 'suspended' } });

    // Get invoice statistics
    const totalInvoices = await Invoice.count({ where: { clientId } });
    const paidInvoices = await Invoice.count({ where: { clientId, status: 'paid' } });
    const unpaidInvoices = await Invoice.count({ 
      where: { 
        clientId, 
        status: { [Op.in]: ['sent', 'overdue'] }
      }
    });

    // Get ticket statistics
    const totalTickets = await Ticket.count({ where: { clientId } });
    const openTickets = await Ticket.count({ 
      where: { 
        clientId, 
        status: { [Op.in]: ['open', 'in_progress', 'waiting_for_customer', 'waiting_for_third_party'] }
      }
    });
    const resolvedTickets = await Ticket.count({ where: { clientId, status: 'resolved' } });

    // Calculate total revenue
    const paidInvoicesData = await Invoice.findAll({
      where: { clientId, status: 'paid' },
      attributes: ['total']
    });
    const totalRevenue = paidInvoicesData.reduce((sum, invoice) => sum + parseFloat(invoice.total), 0);

    // Calculate outstanding balance
    const unpaidInvoicesData = await Invoice.findAll({
      where: { 
        clientId, 
        status: { [Op.in]: ['sent', 'overdue'] }
      },
      attributes: ['total']
    });
    const outstandingBalance = unpaidInvoicesData.reduce((sum, invoice) => sum + parseFloat(invoice.total), 0);

    res.json({
      stats: {
        services: {
          total: totalServices,
          active: activeServices,
          suspended: suspendedServices
        },
        invoices: {
          total: totalInvoices,
          paid: paidInvoices,
          unpaid: unpaidInvoices,
          totalRevenue,
          outstandingBalance
        },
        tickets: {
          total: totalTickets,
          open: openTickets,
          resolved: resolvedTickets
        }
      }
    });

  } catch (error) {
    logger.error('Get client stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve client statistics',
      message: 'An error occurred while retrieving client statistics'
    });
  }
});

module.exports = router;