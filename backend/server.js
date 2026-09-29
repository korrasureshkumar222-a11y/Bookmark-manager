const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const folderRoutes = require('./routes/folderRoutes');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
const localhostOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts. Please try again later.',
  },
});

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, sanitizeValue(nestedValue)])
    );
  }

  if (typeof value !== 'string') {
    return value;
  }

  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

const sanitizeRequestData = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      req.body[key] = sanitizeValue(req.body[key]);
    });
  }

  if (req.query && typeof req.query === 'object') {
    Object.keys(req.query).forEach((key) => {
      req.query[key] = sanitizeValue(req.query[key]);
    });
  }

  if (req.params && typeof req.params === 'object') {
    Object.keys(req.params).forEach((key) => {
      req.params[key] = sanitizeValue(req.params[key]);
    });
  }

  next();
};

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === frontendOrigin || localhostOriginPattern.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(sanitizeRequestData);
app.use((req, res, next) => {
  if (req.path.startsWith('/api/auth/login') || req.path.startsWith('/api/auth/register')) {
    return authLimiter(req, res, next);
  }

  return next();
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/folders', folderRoutes);

app.use((err, req, res, next) => {
  console.error(process.env.NODE_ENV === 'production' ? 'Server error' : err.stack);

  const statusCode = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    message,
  });
});

const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bookmark-manager';

    try {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected successfully');
    } catch (initialError) {
      if (process.env.MONGO_URI) {
        throw initialError;
      }

      console.warn('MongoDB not available locally. Starting in-memory MongoDB for development...');
      const memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log('In-memory MongoDB connected successfully');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
