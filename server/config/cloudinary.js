const cloudinary = require('cloudinary').v2;
const fs = require('fs');

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const uploadToCloudinaryOrLocal = async (file, folder = 'estatehub') => {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto'
      });
      // remove local temp file after upload
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (err) {
      console.error('[Cloudinary Upload Error, falling back to local]:', err.message);
    }
  }

  // Local Storage Fallback
  return {
    url: `/uploads/${file.filename}`,
    publicId: file.filename
  };
};

module.exports = { cloudinary, uploadToCloudinaryOrLocal };
