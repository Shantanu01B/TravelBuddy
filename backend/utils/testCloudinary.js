const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const { checkCloudinaryConnection } = require('./cloudinary');

const testConnection = async () => {
  console.log('================================================');
  console.log('  Testing Cloudinary Connection Status...');
  console.log('================================================');
  console.log(`CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME || '(Not set)'}`);
  console.log(`CLOUDINARY_API_KEY:    ${process.env.CLOUDINARY_API_KEY ? '******' + process.env.CLOUDINARY_API_KEY.slice(-4) : '(Not set)'}`);
  console.log('------------------------------------------------');

  const status = await checkCloudinaryConnection();

  if (status.connected) {
    console.log('🎉 SUCCESS! Cloudinary is 100% CONNECTED & WORKING!');
    console.log(`Connected Account Cloud Name: ${status.cloudName}`);
    console.log('All image uploads will now store directly in your Cloudinary Media Library.');
  } else {
    console.log('⚠️ FALLBACK MODE ACTIVE:');
    console.log(status.message);
  }
  console.log('================================================\n');
};

testConnection();
