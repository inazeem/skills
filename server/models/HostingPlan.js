const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const HostingPlan = sequelize.define('HostingPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('shared', 'vps', 'dedicated', 'reseller', 'cloud'),
    allowNull: false,
    defaultValue: 'shared'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'deprecated'),
    allowNull: false,
    defaultValue: 'active'
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
  billingCycle: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'semi_annually', 'annually', 'biennially'),
    allowNull: false,
    defaultValue: 'monthly'
  },
  setupFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // Hosting specifications
  diskSpace: {
    type: DataTypes.INTEGER, // in MB
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  bandwidth: {
    type: DataTypes.INTEGER, // in MB
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  domains: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 0
    }
  },
  subdomains: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  databases: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 0
    }
  },
  emailAccounts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  ftpAccounts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 0
    }
  },
  // VPS/Dedicated specifications
  cpuCores: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  ram: {
    type: DataTypes.INTEGER, // in MB
    allowNull: false,
    defaultValue: 512,
    validate: {
      min: 1
    }
  },
  // Features
  sslIncluded: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  backupIncluded: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  cdnIncluded: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  supportLevel: {
    type: DataTypes.ENUM('basic', 'standard', 'premium', 'enterprise'),
    allowNull: false,
    defaultValue: 'basic'
  },
  // Control panel
  controlPanel: {
    type: DataTypes.ENUM('cpanel', 'plesk', 'directadmin', 'custom', 'none'),
    allowNull: false,
    defaultValue: 'cpanel'
  },
  // Server specifications
  serverType: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  serverLocation: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  // Custom features
  features: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  // Limits and restrictions
  maxFileSize: {
    type: DataTypes.INTEGER, // in MB
    allowNull: false,
    defaultValue: 2,
    validate: {
      min: 0
    }
  },
  maxExecutionTime: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: false,
    defaultValue: 30,
    validate: {
      min: 0
    }
  },
  maxMemoryLimit: {
    type: DataTypes.INTEGER, // in MB
    allowNull: false,
    defaultValue: 128,
    validate: {
      min: 0
    }
  },
  // Pricing tiers for different billing cycles
  pricingTiers: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  // Sort order for display
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // Created by
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'hosting_plans',
  indexes: [
    {
      fields: ['type', 'status']
    },
    {
      fields: ['price']
    },
    {
      fields: ['createdBy']
    }
  ]
});

// Instance methods
HostingPlan.prototype.getPriceForCycle = function(cycle) {
  if (this.pricingTiers && this.pricingTiers[cycle]) {
    return this.pricingTiers[cycle];
  }
  return this.price;
};

HostingPlan.prototype.isAvailable = function() {
  return this.status === 'active';
};

// Class methods
HostingPlan.findActive = function() {
  return this.findAll({
    where: { status: 'active' },
    order: [['sortOrder', 'ASC'], ['price', 'ASC']]
  });
};

HostingPlan.findByType = function(type) {
  return this.findAll({
    where: { type, status: 'active' },
    order: [['sortOrder', 'ASC'], ['price', 'ASC']]
  });
};

module.exports = HostingPlan;