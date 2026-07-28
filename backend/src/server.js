const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/database');
require('dotenv').config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────
// ✅ Allow all origins including Vercel
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://yacine-acef.netlify.app',
  'https://m-portfolio-5ps0le9xs-mourad-rayanacef-uis-projects.vercel.app/',
  'https://m-portfolio-rouge.vercel.app/', 
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
].filter(Boolean);

// ✅ Simplified CORS - Allow all for production
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// ── Body parsing & security ───────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));

// ── Keep-alive endpoint ──────────────────────────────────────────────────
app.get('/api/keep-alive', async (req, res) => {
  try {
    const { sequelize } = require('./config/database');
    await sequelize.query('SELECT 1');
    res.json({
      status: 'OK',
      message: 'Server and database are awake!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Keep-alive error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ── API Routes ────────────────────────────────────────────────────────────
app.use('/api/skills', require('./routes/skills'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/education', require('./routes/education'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/personal-info', require('./routes/personalInfo'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/experiences', require('./routes/experiences'));

// ── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// ── 404 for unknown API routes ────────────────────────────────────────────
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
      console.log(`📡 Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();