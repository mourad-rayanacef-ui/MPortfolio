const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error('❌ Missing Cloudinary env vars:', {
    CLOUDINARY_CLOUD_NAME: !!CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: !!CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: !!CLOUDINARY_API_SECRET,
  });
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: CLOUDINARY_API_KEY?.trim(),
  api_secret: CLOUDINARY_API_SECRET?.trim(),
});

console.log('☁️ Cloudinary configured with cloud name:', CLOUDINARY_CLOUD_NAME);

module.exports = cloudinary;