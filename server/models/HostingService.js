const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const HostingService = sequelize.define('HostingService', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  serviceId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  domain: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      is: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'suspended', 'cancelled', 'terminated'),
    allowNull: false,
    defaultValue: 'pending'
  },
  // Service details
  hostingPlanId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'hosting_plans',
      key: 'id'
    }
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
  // Billing information
  billingCycle: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'semi_annually', 'annually', 'biennially'),
    allowNull: false,
    defaultValue: 'monthly'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  setupFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // Service dates
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextBillingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  // Server information
  serverId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  serverIp: {
    type: DataTypes.STRING(45),
    allowNull: true,
    validate: {
      isIP: true
    }
  },
  serverLocation: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  // Control panel information
  controlPanelUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  controlPanelUsername: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  controlPanelPassword: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // FTP information
  ftpHost: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ftpUsername: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  ftpPassword: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // Database information
  databaseHost: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  databaseName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  databaseUsername: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  databasePassword: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // Usage tracking
  diskUsage: {
    type: DataTypes.INTEGER, // in MB
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  bandwidthUsage: {
    type: DataTypes.INTEGER, // in MB
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  lastUsageUpdate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // SSL information
  sslEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  sslExpiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Backup information
  lastBackup: {
    type: DataTypes.DATE,
    allowNull: true
  },
  backupEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  // Custom configurations
  customConfig: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  // Notes and comments
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Suspension information
  suspensionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  suspendedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  suspendedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'hosting_services',
  indexes: [
    {
      fields: ['serviceId']
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
      fields: ['nextBillingDate']
    },
    {
      fields: ['domain']
    }
  ]
});

// Instance methods
HostingService.prototype.isActive = function() {
  return this.status === 'active';
};

HostingService.prototype.isSuspended = function() {
  return this.status === 'suspended';
};

HostingService.prototype.isPending = function() {
  return this.status === 'pending';
};

HostingService.prototype.isCancelled = function() {
  return this.status === 'cancelled';
};

HostingService.prototype.getUsagePercentage = function() {
  // This would need to be calculated based on the hosting plan limits
  return 0;
};

HostingService.prototype.suspend = async function(reason, suspendedBy) {
  return await this.update({
    status: 'suspended',
    suspensionReason: reason,
    suspendedAt: new Date(),
    suspendedBy
  });
};

HostingService.prototype.activate = async function() {
  return await this.update({
    status: 'active',
    suspensionReason: null,
    suspendedAt: null,
    suspendedBy: null
  });
};

// Class methods
HostingService.findByClient = function(clientId) {
  return this.findAll({
    where: { clientId },
    order: [['createdAt', 'DESC']]
  });
};

HostingService.findByReseller = function(resellerId) {
  return this.findAll({
    where: { resellerId },
    order: [['createdAt', 'DESC']]
  });
};

HostingService.findActive = function() {
  return this.findAll({
    where: { status: 'active' }
  });
};

HostingService.findPendingBilling = function() {
  const today = new Date();
  return this.findAll({
    where: {
      status: 'active',
      nextBillingDate: {
        [sequelize.Op.lte]: today
      }
    }
  });
};

module.exports = HostingService;