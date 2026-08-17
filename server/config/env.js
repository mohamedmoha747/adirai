import dotenv from 'dotenv';

dotenv.config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/adirai'),
  jwtSecret: required('JWT_SECRET', 'dev-only-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  paymentApiKey: process.env.PAYMENT_API_KEY || '',
  whatsappApiKey: process.env.WHATSAPP_API_KEY || '',
  smsApiKey: process.env.SMS_API_KEY || '',
  emailApiKey: process.env.EMAIL_API_KEY || '',
};

export const isDev = env.nodeEnv !== 'production';
