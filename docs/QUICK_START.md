# Quick Start Guide

This guide will help you get the Barber Booking Application up and running on your local machine in just a few minutes.

## 🚀 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd barber-booking-app
```

### 2. Set Up the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit the .env file with your configuration
# (See Environment Variables section below)

# Start the development server
npm run dev
```

The backend will be running on `http://localhost:5000`

### 3. Set Up the Frontend

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be running on `http://localhost:3000`

## ⚙️ Environment Variables

### Backend (.env file)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/barber-booking-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (Optional for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@barberbooking.com

# SMS Configuration (Optional for development)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Payment Configuration (Optional for development)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# App Configuration
APP_NAME=Barber Booking App
APP_URL=http://localhost:3000
```

### Frontend (.env file)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # On Windows
   net start MongoDB

   # On Linux
   sudo systemctl start mongod
   ```

2. Create the database:
   ```bash
   mongosh
   use barber-booking-app
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

## 🧪 Testing the Application

### 1. Health Check

Visit `http://localhost:5000/health` to verify the backend is running.

### 2. API Documentation

The API endpoints are available at `http://localhost:5000/api`

### 3. Frontend Application

Visit `http://localhost:3000` to see the application.

## 👤 Creating Test Users

### Using the API

1. **Register a Client:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "John",
       "lastName": "Doe",
       "email": "john@example.com",
       "password": "password123",
       "phone": "+1234567890",
       "role": "client"
     }'
   ```

2. **Register a Barber:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Mike",
       "lastName": "Barber",
       "email": "mike@example.com",
       "password": "password123",
       "phone": "+1234567890",
       "role": "barber"
     }'
   ```

### Using the Frontend

1. Visit `http://localhost:3000/register`
2. Fill out the registration form
3. Choose your role (client or barber)
4. Complete the registration

## 🔧 Development Workflow

### Backend Development

```bash
cd backend

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

### Frontend Development

```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## 📁 Project Structure

```
barber-booking-app/
├── backend/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── .env.example         # Environment variables template
│   └── package.json         # Dependencies and scripts
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── package.json         # Dependencies and scripts
└── docs/                    # Documentation
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **MongoDB connection failed:**
   - Ensure MongoDB is running
   - Check your connection string
   - Verify network connectivity

3. **Dependencies installation failed:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Frontend build errors:**
   ```bash
   # Clear build cache
   npm run build -- --reset-cache
   ```

### Getting Help

- Check the [Project Overview](PROJECT_OVERVIEW.md) for detailed information
- Review the API documentation
- Check the console for error messages
- Search existing issues on GitHub

## 🚀 Next Steps

Once you have the application running:

1. **Explore the Features:**
   - Register as both a client and barber
   - Create barber profiles and services
   - Book appointments
   - Test the notification system

2. **Customize the Application:**
   - Modify the styling in `frontend/src/index.css`
   - Add new features to the backend
   - Customize the database models

3. **Deploy to Production:**
   - Set up production environment variables
   - Configure a production database
   - Deploy to your preferred hosting platform

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/)

---

**Happy coding! 🎉**