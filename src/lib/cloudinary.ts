import { v2 as cloudinary } from 'cloudinary';

console.log('🔵 Initializing Cloudinary with:');
console.log('- cloud_name:', process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING');
console.log('- api_key:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING');
console.log('- api_secret:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export default cloudinary;