require('dotenv').config({ path: './config.env' });

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:8081', 'http://localhost:8082', 'http://localhost:8083']
  },
  api: {
    version: process.env.API_VERSION || 'v1'
  },
  database: {
    url: process.env.DATABASE_URL || null,
    name: process.env.DB_NAME || 'pointify'
  }
};

module.exports = config; 