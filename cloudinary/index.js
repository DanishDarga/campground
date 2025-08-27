const cloudinary = require('cloudinary').v2
const { v4: uuidv4 } = require('uuid');

const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})
console.log("Cloudinary Config:", cloudinary.config());
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'YelpCamp',
        // supports promises as well
        public_id: (req, file) => uuidv4(),
    },
});
module.exports = { cloudinary, storage }; 