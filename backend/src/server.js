const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/database');
require('dotenv').config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────
// Add every origin that should be allowed to call this API.
// On Render, set the CLIENT_URL env variable to your Netlify URL,
// e.g.  CLIENT_URL=https://your-portfolio.netlify.app
const allowedOrigins = [
  process.env.CLIENT_URL,          // production Netlify URL (set in Render env vars)
  'http://localhost:5173',          // Vite dev server
  'http://localhost:3000',          // CRA dev server (just in case)
].filter(Boolean);                  // remove undefined if CLIENT_URL not set yet

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};
app.use(cors(corsOptions));

// ── Body parsing & security ───────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan('dev'));

// ── API Routes ────────────────────────────────────────────────────────────
app.use('/api/skills',         require('./routes/skills'));
app.use('/api/projects',       require('./routes/projects'));
app.use('/api/education',      require('./routes/education'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/courses',        require('./routes/courses'));
app.use('/api/personal-info',  require('./routes/personalInfo'));
app.use('/api/auth',           require('./routes/auth'));
app.use('/api/experiences',    require('./routes/experiences'));

// ── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ── 404 for unknown API routes ────────────────────────────────────────────
// (No static file serving — frontend is deployed separately on Netlify)
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// ── Global error handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();