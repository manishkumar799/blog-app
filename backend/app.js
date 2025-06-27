const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { connectDB } = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', commentRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;