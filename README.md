# Web Hosting Management and Billing Software

A comprehensive web hosting management and billing software that streamlines hosting service management, invoicing, and payment tracking for web hosting businesses. The software caters to the needs of administrators, resellers, and end-users, providing an intuitive interface for each group.

## 🚀 Features

### Core Features

#### Client Management
- ✅ Client profile creation and management
- ✅ Contact information management (email, phone, address)
- ✅ Client categorization (by plan, status, or custom groups)
- ✅ Role-based access control (admin, reseller, client)

#### Service Provisioning
- ✅ Hosting plan creation and management (shared, VPS, dedicated, reseller, cloud)
- ✅ Automated service provisioning and deprovisioning
- ✅ Support for various hosting platforms (cPanel, Plesk, DirectAdmin)
- ✅ Service status tracking and management

#### Invoicing and Payment Tracking
- ✅ Automated invoice generation and sending
- ✅ Payment tracking and recording (manual, PayPal, Stripe)
- ✅ Support for recurring payments and subscriptions
- ✅ Customizable invoice templates
- ✅ Multiple billing cycles (monthly, quarterly, annually, etc.)

#### Automated Payment Processing
- ✅ Integration with popular payment gateways (PayPal, Stripe)
- ✅ Automated payment retries and failed payment handling
- ✅ Secure payment processing

#### Reporting and Analytics
- ✅ Revenue and income tracking
- ✅ Client activity and service usage reports
- ✅ Payment history and transaction logs
- ✅ Comprehensive dashboard analytics

#### Security and Access Control
- ✅ Role-based access control (RBAC) for administrators, resellers, and end-users
- ✅ Two-factor authentication (2FA) support
- ✅ Data encryption and secure storage
- ✅ JWT-based authentication

#### Integration and API
- ✅ RESTful API for integrating with third-party services
- ✅ Support for webhooks and callbacks for automated workflows
- ✅ Domain registrar integration support

### User Interfaces

#### Admin Interface
- 📊 Dashboard for monitoring client activity, revenue, and system health
- 👥 Client management and service provisioning tools
- 📈 Reporting and analytics tools
- ⚙️ System configuration and settings

#### Reseller Interface
- 👥 Client management and service provisioning tools
- 💰 Invoicing and payment tracking tools
- 📊 Limited access to admin features based on RBAC
- 📈 Performance analytics

#### End-User Interface
- 📊 Dashboard for managing hosting services and tracking invoices
- 💳 Payment portal for secure transactions
- 🎫 Support ticket system for submitting requests and issues
- 👤 Profile management

### Additional Features

#### Domain Management
- 🌐 Domain registration and management integration
- 🔔 Automated domain renewal reminders

#### Ticketing System
- 🎫 Support ticket system for clients to submit requests and issues
- 📋 Ticket assignment and tracking for administrators and resellers
- ⏱️ SLA tracking and management

#### Notification System
- 📧 Customizable notification templates for clients and administrators
- 🔔 Automated notifications for payment reminders, service provisioning, and other events
- 📱 Email and in-app notifications

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with bcrypt password hashing
- **Payment Processing**: Stripe, PayPal
- **Email**: Nodemailer with SMTP
- **File Upload**: Multer
- **Validation**: Express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate limiting

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **State Management**: React Query, Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Forms**: React Hook Form
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Notifications**: React Hot Toast

### Development Tools
- **Package Manager**: npm
- **Build Tool**: Create React App
- **Code Quality**: ESLint
- **Version Control**: Git

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd web-hosting-manager
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hosting_manager
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
EMAIL_FROM=noreply@yourdomain.com

# Payment Gateway Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_here
```

### 4. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE hosting_manager;
```

Run database migrations:

```bash
npm run db:migrate
```

Seed the database with initial data:

```bash
npm run db:seed
```

### 5. Start the Application

#### Development Mode

```bash
# Start both backend and frontend
npm run dev

# Or start them separately
npm run server    # Backend only
npm run client    # Frontend only
```

#### Production Mode

```bash
# Build the frontend
npm run build

# Start the production server
NODE_ENV=production npm run server
```

## 📁 Project Structure

```
web-hosting-manager/
├── server/                 # Backend application
│   ├── database/          # Database configuration and migrations
│   ├── middleware/        # Express middleware
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── index.js          # Server entry point
├── client/               # Frontend React application
│   ├── public/           # Static files
│   ├── src/              # React source code
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── package.json
├── uploads/              # File uploads directory
├── logs/                 # Application logs
├── package.json          # Root package.json
└── README.md
```

## 🔧 Configuration

### Database Configuration

The application uses PostgreSQL as the primary database. Configure your database connection in the `.env` file.

### Email Configuration

Set up SMTP settings for email notifications:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@yourdomain.com
```

### Payment Gateway Configuration

#### Stripe
1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Add them to your `.env` file

#### PayPal
1. Create a PayPal developer account
2. Create an app to get your client ID and secret
3. Add them to your `.env` file

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Two-Factor Authentication**: TOTP-based 2FA support
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Cross-origin resource sharing protection
- **Helmet**: Security headers middleware
- **Input Validation**: Comprehensive input validation and sanitization
- **SQL Injection Protection**: Sequelize ORM with parameterized queries

## 📊 API Documentation

The API provides RESTful endpoints for all functionality:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Client Management
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Hosting Services
- `GET /api/hosting/plans` - Get hosting plans
- `POST /api/hosting/plans` - Create hosting plan
- `GET /api/hosting/services` - Get hosting services
- `POST /api/hosting/services` - Create hosting service

### Billing and Invoices
- `GET /api/billing/invoices` - Get invoices
- `POST /api/billing/invoices` - Create invoice
- `GET /api/billing/invoices/:id` - Get invoice details
- `PUT /api/billing/invoices/:id` - Update invoice

### Support Tickets
- `GET /api/tickets` - Get tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id` - Update ticket

## 🧪 Testing

Run the test suite:

```bash
# Backend tests
npm test

# Frontend tests
cd client
npm test
```

## 📦 Deployment

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### Environment Variables for Production

Make sure to set the following environment variables in production:

- `NODE_ENV=production`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`
- `SMTP_*` variables
- `STRIPE_*` or `PAYPAL_*` variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact support at support@yourdomain.com

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Complete hosting management system
- User authentication and authorization
- Billing and invoicing system
- Support ticket system
- Modern React frontend
- RESTful API

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Sequelize](https://sequelize.org/) - ORM
- [Stripe](https://stripe.com/) - Payment processing
- [PayPal](https://www.paypal.com/) - Payment processing

---

**Note**: This is a comprehensive web hosting management system. Make sure to review and customize the configuration according to your specific needs before deploying to production.