# Barber Shop Booking Application

A modern, full-stack web application that enables barbers to manage bookings and clients to schedule appointments online.

## 🚀 Features

### For Barbers
- **Profile Management**: Create and manage professional profiles with photos, bio, and contact information
- **Availability Management**: Set working hours, days off, and special availability
- **Service Catalog**: Define services with descriptions, durations, and pricing
- **Booking Management**: View, accept, reject, and reschedule appointments
- **Client Management**: Access client history and preferences
- **Calendar Integration**: Sync with popular calendar systems
- **Analytics Dashboard**: View booking statistics and earnings

### For Clients
- **User Registration**: Easy signup and profile creation
- **Barber Discovery**: Browse barber profiles, services, and reviews
- **Online Booking**: Select services, choose time slots, and book appointments
- **Payment Processing**: Secure online payments with multiple payment methods
- **Booking History**: View past and upcoming appointments
- **Notifications**: Automated reminders via email and SMS
- **Reviews & Ratings**: Rate and review barbers after appointments

### Core Features
- **Real-time Scheduling**: Live availability updates
- **Payment Integration**: Stripe/PayPal integration for secure payments
- **Notification System**: Email and SMS reminders
- **Responsive Design**: Mobile-first approach for all devices
- **Admin Dashboard**: Comprehensive management tools
- **API Integration**: RESTful API for third-party integrations

## 🏗️ Architecture

```
barber-booking-app/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React context providers
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
├── backend/                  # Node.js/Express backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic services
│   │   └── utils/           # Utility functions
│   └── config/              # Configuration files
└── docs/                    # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Calendar** - Calendar component
- **Stripe Elements** - Payment processing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email notifications
- **Twilio** - SMS notifications
- **Stripe** - Payment processing
- **Multer** - File uploads
- **Cors** - Cross-origin resource sharing

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Heroku/Vercel** - Deployment

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd barber-booking-app
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment variables
   cp backend/.env.example backend/.env
   
   # Frontend environment variables
   cp frontend/.env.example frontend/.env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB
   mongod
   
   # Run database migrations
   cd backend
   npm run migrate
   ```

5. **Start Development Servers**
   ```bash
   # Start backend server (port 5000)
   cd backend
   npm run dev
   
   # Start frontend server (port 3000)
   cd frontend
   npm start
   ```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Barbers
- `GET /api/barbers` - Get all barbers
- `GET /api/barbers/:id` - Get barber details
- `POST /api/barbers` - Create barber profile
- `PUT /api/barbers/:id` - Update barber profile
- `GET /api/barbers/:id/services` - Get barber services
- `GET /api/barbers/:id/availability` - Get barber availability

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/available-slots` - Get available time slots

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Helmet.js security headers
- Environment variable protection

## 📧 Notifications

- Email notifications for booking confirmations
- SMS reminders for upcoming appointments
- Automated cancellation notifications
- Welcome emails for new users

## 💳 Payment Integration

- Stripe payment processing
- Multiple payment methods support
- Secure payment handling
- Refund processing
- Payment history tracking

## 🎨 UI/UX Features

- Responsive design for all devices
- Dark/light mode toggle
- Loading states and error handling
- Intuitive navigation
- Accessibility compliance
- Modern, clean interface

## 🚀 Deployment

### Backend Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to hosting service
npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact:
- Email: support@barberbooking.com
- Documentation: [docs/](docs/)

---

**Built with ❤️ for the barber community**