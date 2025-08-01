const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  invoiceNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  resellerId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded'),
    allowNull: false,
    defaultValue: 'draft'
  },
  type: {
    type: DataTypes.ENUM('recurring', 'one_time', 'setup', 'addon', 'credit'),
    allowNull: false,
    defaultValue: 'recurring'
  },
  // Amount information
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  // Dates
  issueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  paidDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Payment information
  paymentMethod: {
    type: DataTypes.ENUM('manual', 'stripe', 'paypal', 'bank_transfer', 'check', 'credit'),
    allowNull: true
  },
  paymentTransactionId: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // Billing information
  billingAddress: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  shippingAddress: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  // Tax information
  taxRate: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 1
    }
  },
  taxExempt: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  // Notes and terms
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Email tracking
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sentBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  // Reminder tracking
  reminderSent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  lastReminderSent: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Related service
  hostingServiceId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'hosting_services',
      key: 'id'
    }
  },
  // Custom fields
  customFields: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'invoices',
  indexes: [
    {
      fields: ['invoiceNumber']
    },
    {
      fields: ['clientId']
    },
    {
      fields: ['resellerId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['dueDate']
    },
    {
      fields: ['issueDate']
    },
    {
      fields: ['hostingServiceId']
    }
  ]
});

// Instance methods
Invoice.prototype.isPaid = function() {
  return this.status === 'paid';
};

Invoice.prototype.isOverdue = function() {
  return this.status === 'overdue' || (this.dueDate < new Date() && this.status !== 'paid');
};

Invoice.prototype.isDraft = function() {
  return this.status === 'draft';
};

Invoice.prototype.isCancelled = function() {
  return this.status === 'cancelled';
};

Invoice.prototype.getDaysOverdue = function() {
  if (this.isPaid() || this.isDraft() || this.isCancelled()) {
    return 0;
  }
  const today = new Date();
  const dueDate = new Date(this.dueDate);
  const diffTime = today - dueDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

Invoice.prototype.calculateTotal = function() {
  const total = parseFloat(this.subtotal) + parseFloat(this.taxAmount) - parseFloat(this.discountAmount);
  return Math.max(0, total);
};

Invoice.prototype.markAsPaid = async function(paymentMethod, transactionId) {
  return await this.update({
    status: 'paid',
    paidDate: new Date(),
    paymentMethod,
    paymentTransactionId: transactionId
  });
};

Invoice.prototype.markAsOverdue = async function() {
  if (this.status !== 'paid' && this.status !== 'cancelled') {
    return await this.update({
      status: 'overdue'
    });
  }
  return this;
};

// Class methods
Invoice.findByClient = function(clientId) {
  return this.findAll({
    where: { clientId },
    order: [['issueDate', 'DESC']]
  });
};

Invoice.findByReseller = function(resellerId) {
  return this.findAll({
    where: { resellerId },
    order: [['issueDate', 'DESC']]
  });
};

Invoice.findOverdue = function() {
  const today = new Date();
  return this.findAll({
    where: {
      status: {
        [sequelize.Op.in]: ['sent', 'overdue']
      },
      dueDate: {
        [sequelize.Op.lt]: today
      }
    }
  });
};

Invoice.findPendingPayment = function() {
  return this.findAll({
    where: {
      status: {
        [sequelize.Op.in]: ['sent', 'overdue']
      }
    }
  });
};

Invoice.generateInvoiceNumber = async function() {
  const prefix = 'INV';
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Get the last invoice number for this month
  const lastInvoice = await this.findOne({
    where: {
      invoiceNumber: {
        [sequelize.Op.like]: `${prefix}-${year}${month}-%`
      }
    },
    order: [['invoiceNumber', 'DESC']]
  });
  
  let sequence = 1;
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }
  
  return `${prefix}-${year}${month}-${String(sequence).padStart(4, '0')}`;
};

module.exports = Invoice;