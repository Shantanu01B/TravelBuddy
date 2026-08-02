const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || ''
  });
};

/**
 * Checks if Cloudinary credentials are valid and connection is active
 */
const checkCloudinaryConnection = async () => {
  configureCloudinary();
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME.includes('demo') || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
      return {
        connected: false,
        mode: 'fallback',
        message: 'Cloudinary API keys not configured in backend/.env. Using fallback placeholder URLs.'
      };
    }

    return new Promise((resolve) => {
      cloudinary.api.ping((err, result) => {
        if (err) {
          const errMsg = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
          return resolve({
            connected: false,
            mode: 'fallback',
            errorDetails: errMsg,
            message: `Cloudinary connection error: ${errMsg}`
          });
        }

        if (result && result.status === 'ok') {
          return resolve({
            connected: true,
            mode: 'active',
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            message: 'Cloudinary successfully connected!'
          });
        }

        resolve({
          connected: false,
          mode: 'fallback',
          message: 'Unknown response from Cloudinary API'
        });
      });
    });
  } catch (error) {
    return {
      connected: false,
      mode: 'fallback',
      message: `Cloudinary error: ${error.message}`
    };
  }
};

/**
 * Helper to upload image buffer or fallback gracefully if credentials are not active
 */
const uploadImage = async (fileBuffer, folder = 'travelbuddy') => {
  configureCloudinary();
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
      return 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop';
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folder, resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (err) {
    console.error('Cloudinary Upload Error:', err.message);
    return 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop';
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  checkCloudinaryConnection
};
