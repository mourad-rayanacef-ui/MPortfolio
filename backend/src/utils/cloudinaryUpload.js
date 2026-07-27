const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (fileBuffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `portfolio/${folder}`, ...options },
      (error, result) => {
        if (error) {
          // Log everything Cloudinary gives us — error.message alone hides the cause
          console.error('❌ Cloudinary upload error:', {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
            details: error.error || error,
          });
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// resourceType MUST match what was used at upload time ('raw' for PDFs, 'image' for images)
// otherwise Cloudinary can't find the asset to delete and silently no-ops.
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };