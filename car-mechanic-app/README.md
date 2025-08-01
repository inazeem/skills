# Car Mechanic Web Application

A comprehensive Laravel-based web application for car mechanic businesses to manage services, bookings, and customer communications.

## Features

### Public Features
- **Homepage**: Showcase services with hero section and call-to-action
- **About Us**: Company information and team details
- **Services**: Display all available automotive services
- **Booking System**: Online appointment booking with conflict prevention
- **Contact Form**: Customer inquiry form with Google Maps integration

### Admin Features
- **Dashboard**: Overview of bookings, services, and messages
- **Service Management**: CRUD operations for automotive services
- **Booking Management**: View, edit, and manage customer appointments
- **Contact Management**: Handle customer messages and inquiries
- **Settings**: Customizable business information and booking parameters

### Technical Features
- **Authentication**: Laravel's built-in authentication system
- **Database**: SQLite for development (easily configurable for MySQL/PostgreSQL)
- **Responsive Design**: Bootstrap 5 with modern UI/UX
- **Form Validation**: Comprehensive input validation and error handling
- **Booking Conflict Prevention**: Prevents double-booking of time slots
- **Dynamic Time Slots**: Available time slots based on service duration and existing bookings

## Installation

### Prerequisites
- PHP 8.1 or higher
- Composer
- SQLite (or MySQL/PostgreSQL)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd car-mechanic-app
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database setup**
   ```bash
   # For SQLite (default)
   touch database/database.sqlite
   
   # Or configure MySQL/PostgreSQL in .env file
   ```

5. **Run migrations and seeders**
   ```bash
   php artisan migrate
   php artisan db:seed --class=InitialDataSeeder
   ```

6. **Create storage link (for file uploads)**
   ```bash
   php artisan storage:link
   ```

7. **Start the development server**
   ```bash
   php artisan serve
   ```

## Database Structure

### Tables

#### Services
- `id` - Primary key
- `name` - Service name
- `description` - Service description
- `price` - Service price
- `duration_minutes` - Service duration
- `image` - Service image (optional)
- `is_active` - Service availability
- `sort_order` - Display order
- `created_at`, `updated_at` - Timestamps

#### Bookings
- `id` - Primary key
- `service_id` - Foreign key to services
- `customer_name` - Customer's full name
- `customer_email` - Customer's email
- `customer_phone` - Customer's phone number
- `vehicle_make` - Vehicle make
- `vehicle_model` - Vehicle model
- `vehicle_year` - Vehicle year
- `license_plate` - License plate (optional)
- `booking_date` - Appointment date
- `booking_time` - Appointment time
- `notes` - Additional notes
- `status` - Booking status (pending/confirmed/completed/cancelled)
- `created_at`, `updated_at` - Timestamps

#### Contacts
- `id` - Primary key
- `name` - Contact name
- `email` - Contact email
- `phone` - Contact phone (optional)
- `subject` - Message subject
- `message` - Message content
- `status` - Message status (unread/read/replied)
- `created_at`, `updated_at` - Timestamps

#### Settings
- `id` - Primary key
- `key` - Setting key (unique)
- `value` - Setting value
- `type` - Setting type (text/textarea/image/boolean)
- `group` - Setting group (general/contact/booking)
- `label` - Display label
- `description` - Setting description
- `created_at`, `updated_at` - Timestamps

## Usage

### Admin Access
1. Register a new account at `/register`
2. Login at `/login`
3. Access admin dashboard at `/admin/dashboard`

### Managing Services
- View all services: `/admin/services`
- Add new service: `/admin/services/create`
- Edit service: `/admin/services/{id}/edit`
- Delete service: Use delete button in services list

### Managing Bookings
- View all bookings: `/admin/bookings`
- Edit booking: `/admin/bookings/{id}/edit`
- View booking details: `/admin/bookings/{id}`
- Quick status updates available in booking details

### Managing Messages
- View all messages: `/admin/contacts`
- View message details: `/admin/contacts/{id}`
- Mark messages as read/replied

### Customizing Settings
- Access settings: `/admin/settings`
- Modify company information, contact details, and booking parameters
- Update Google Maps embed code for location display

## Configuration

### Environment Variables
Key environment variables in `.env`:

```env
APP_NAME="Car Mechanic App"
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
MAIL_MAILER=log
```

### Database Configuration
For production, update database settings in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=car_mechanic_app
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Email Configuration
For production, configure email settings:

```env
MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

## API Endpoints

### Booking System
- `GET /book` - Booking form
- `POST /book` - Create booking
- `GET /book/available-slots` - Get available time slots (AJAX)
- `GET /book/success` - Booking confirmation page

### Services
- `GET /services` - List all services
- `GET /services/{service}` - View service details

### Contact
- `GET /contact` - Contact form
- `POST /contact` - Submit contact form

## Security Features

- CSRF protection on all forms
- Input validation and sanitization
- SQL injection prevention through Eloquent ORM
- XSS protection through Blade templating
- Rate limiting on authentication attempts
- Secure password hashing

## Customization

### Styling
- Modify `resources/views/layouts/app.blade.php` for layout changes
- Update Bootstrap classes for styling
- Add custom CSS in the layout file

### Business Logic
- Modify controllers in `app/Http/Controllers/`
- Update models in `app/Models/`
- Add new routes in `routes/web.php`

### Content
- Update settings through admin panel
- Modify seeder data in `database/seeders/InitialDataSeeder.php`
- Update views in `resources/views/`

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Ensure database file exists and is writable
   - Check database configuration in `.env`

2. **File upload issues**
   - Run `php artisan storage:link`
   - Ensure storage directory is writable

3. **Route not found errors**
   - Clear route cache: `php artisan route:clear`
   - Clear config cache: `php artisan config:clear`

4. **Permission errors**
   - Ensure proper file permissions on storage and bootstrap/cache directories

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Support

For support and questions, please create an issue in the repository or contact the development team.
