# Blog Application

A full-stack blog application with React frontend and Node.js backend, featuring user authentication, post management, and real-time commenting.

## Features

### Core Functionality
- User registration and authentication (JWT)
- Create, edit, and delete blog posts
- Comment system for posts
- User profiles and management
- Responsive design for all devices

### Advanced Features
- Filter posts by author
- Sort posts by date (newest/oldest)
- Real-time UI updates
- Form validation and error handling
- Secure cookie-based authentication

## Tech Stack

### Frontend
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Forms**: React Hook Form
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT tokens
- **Validation**: Joi schemas
- **Security**: Bcrypt password hashing
- **Testing**: Jest with Supertest

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL database
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   npm install
   ```

2. **Environment configuration**
   Create `.env` file in backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=blog_app
   ```

3. **Database setup**
   - Create MySQL database: `blog_app`
   - Tables will be auto-created by Sequelize migrations

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```
   Application runs on `http://localhost:5173`

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile

### Post Management
- `GET /api/posts` - Get all posts with authors and comments
- `POST /api/posts` - Create new post (authentication required)
- `GET /api/posts/:id` - Get specific post by ID
- `PUT /api/posts/:id` - Update post (author only)
- `DELETE /api/posts/:id` - Delete post (author only)

### Comment System
- `GET /api/posts/:postId/comments` - Get all comments for a post
- `POST /api/posts/:postId/comments` - Add comment to post (authentication required)

## Testing

### Backend Testing
Run comprehensive test suite:
```bash
cd backend

# Run all tests
npm test

```

### Test Coverage Includes
- User authentication flow
- Post CRUD operations
- Comment functionality
- Input validation
- Error handling
- Database operations

## Project Structure

```
blog-app/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/          # Redux store and slices
│   │   ├── pages/          # Page components
│   │   └── utils/          # Helper functions
│   ├── public/
│   └── package.json
├── backend/
│   ├── config/             # Database configuration
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Authentication & validation
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── validators/         # Joi validation schemas
│   ├── tests/              # Test files
│   └── package.json
└── README.md
```

## Key Technical Decisions

### Frontend Architecture
- **Redux Toolkit**: Chosen for predictable state management and built-in async handling
- **Tailwind CSS**: Enables rapid UI development with consistent design system
- **Cookie Authentication**: More secure than localStorage for token storage
- **Client-side Filtering**: Efficient post filtering using React useMemo hooks

### Backend Architecture
- **JWT Authentication**: Stateless authentication suitable for API scaling
- **Sequelize ORM**: Simplifies database operations and provides migration support
- **Joi Validation**: Comprehensive input validation and sanitization
- **Modular Structure**: Separation of concerns with dedicated folders for each layer

## Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
```

### Backend
```bash
npm run dev          # Start with nodemon
npm start            # Start production server
npm test             # Run test suite
```

## Common Issues & Solutions

1. **Database Connection**: Ensure MySQL is running and credentials are correct in `.env`
2. **Port Conflicts**: Change PORT in backend `.env` if 5000 is occupied
3. **CORS Issues**: Backend is configured to accept requests from frontend origin
4. **Authentication**: Cookies are used for auth - ensure both servers are running

## Future Enhancements

- Rich text editor for posts
- Image upload functionality
- Search and advanced filtering
- Email notifications
- Admin dashboard
- Post categories and tags
- Pagination for large datasets