/**
 * Application constants
 */

// OTP Configuration
const OTP_LENGTH = 6;
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_ATTEMPTS = 3;
const RESEND_COOLDOWN = 60 * 1000; // 1 minute in milliseconds

// Rate Limiting
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;