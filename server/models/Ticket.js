const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ticketNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'waiting_for_customer', 'waiting_for_third_party', 'resolved', 'closed'),
    allowNull: false,
    defaultValue: 'open'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    allowNull: false,
    defaultValue: 'medium'
  },
  type: {
    type: DataTypes.ENUM('technical', 'billing', 'sales', 'general', 'abuse', 'feature_request'),
    allowNull: false,
    defaultValue: 'general'
  },
  // User information
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
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
  // Department and category
  department: {
    type: DataTypes.ENUM('technical', 'billing', 'sales', 'support'),
    allowNull: false,
    defaultValue: 'support'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  // Dates
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // SLA tracking
  slaLevel: {
    type: DataTypes.ENUM('basic', 'standard', 'premium', 'enterprise'),
    allowNull: false,
    defaultValue: 'basic'
  },
  slaResponseTime: {
    type: DataTypes.INTEGER, // in hours
    allowNull: false,
    defaultValue: 24
  },
  slaResolutionTime: {
    type: DataTypes.INTEGER, // in hours
    allowNull: false,
    defaultValue: 72
  },
  firstResponseAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Customer satisfaction
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Internal notes
  internalNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Tags and labels
  tags: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  // Custom fields
  customFields: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  // Merged tickets
  mergedInto: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'tickets',
      key: 'id'
    }
  },
  // Escalation
  escalated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  escalatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  escalatedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'tickets',
  indexes: [
    {
      fields: ['ticketNumber']
    },
    {
      fields: ['clientId']
    },
    {
      fields: ['assignedTo']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['type']
    },
    {
      fields: ['department']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['hostingServiceId']
    }
  ]
});

// Instance methods
Ticket.prototype.isOpen = function() {
  return ['open', 'in_progress', 'waiting_for_customer', 'waiting_for_third_party'].includes(this.status);
};

Ticket.prototype.isResolved = function() {
  return this.status === 'resolved';
};

Ticket.prototype.isClosed = function() {
  return this.status === 'closed';
};

Ticket.prototype.isUrgent = function() {
  return this.priority === 'urgent';
};

Ticket.prototype.isHighPriority = function() {
  return ['high', 'urgent'].includes(this.priority);
};

Ticket.prototype.getSLAStatus = function() {
  if (this.isResolved() || this.isClosed()) {
    return 'met';
  }
  
  const now = new Date();
  const createdAt = new Date(this.createdAt);
  const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
  
  if (hoursSinceCreation > this.slaResponseTime && !this.firstResponseAt) {
    return 'breached';
  }
  
  if (hoursSinceCreation > this.slaResolutionTime) {
    return 'breached';
  }
  
  return 'within_sla';
};

Ticket.prototype.markAsResolved = async function() {
  return await this.update({
    status: 'resolved',
    resolvedAt: new Date()
  });
};

Ticket.prototype.close = async function() {
  return await this.update({
    status: 'closed',
    closedAt: new Date()
  });
};

Ticket.prototype.assignTo = async function(userId) {
  return await this.update({
    assignedTo: userId
  });
};

// Class methods
Ticket.findByClient = function(clientId) {
  return this.findAll({
    where: { clientId },
    order: [['createdAt', 'DESC']]
  });
};

Ticket.findByAssignee = function(assignedTo) {
  return this.findAll({
    where: { assignedTo },
    order: [['priority', 'DESC'], ['createdAt', 'ASC']]
  });
};

Ticket.findOpen = function() {
  return this.findAll({
    where: {
      status: {
        [sequelize.Op.in]: ['open', 'in_progress', 'waiting_for_customer', 'waiting_for_third_party']
      }
    },
    order: [['priority', 'DESC'], ['createdAt', 'ASC']]
  });
};

Ticket.findOverdue = function() {
  const now = new Date();
  return this.findAll({
    where: {
      status: {
        [sequelize.Op.in]: ['open', 'in_progress', 'waiting_for_customer', 'waiting_for_third_party']
      },
      dueDate: {
        [sequelize.Op.lt]: now
      }
    }
  });
};

Ticket.findSLAViolations = function() {
  const now = new Date();
  const slaViolationTime = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago
  
  return this.findAll({
    where: {
      status: {
        [sequelize.Op.in]: ['open', 'in_progress', 'waiting_for_customer', 'waiting_for_third_party']
      },
      createdAt: {
        [sequelize.Op.lt]: slaViolationTime
      },
      firstResponseAt: null
    }
  });
};

Ticket.generateTicketNumber = async function() {
  const prefix = 'TKT';
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Get the last ticket number for this month
  const lastTicket = await this.findOne({
    where: {
      ticketNumber: {
        [sequelize.Op.like]: `${prefix}-${year}${month}-%`
      }
    },
    order: [['ticketNumber', 'DESC']]
  });
  
  let sequence = 1;
  if (lastTicket) {
    const lastSequence = parseInt(lastTicket.ticketNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }
  
  return `${prefix}-${year}${month}-${String(sequence).padStart(4, '0')}`;
};

module.exports = Ticket;