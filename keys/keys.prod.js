module.exports = {
  SESSION_SECRET: process.env.SESSION_SECRET || 'some-secret-key',
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT || 465,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  BASE_URL: process.env.BASE_URL || 'http://localhost:4000'
};