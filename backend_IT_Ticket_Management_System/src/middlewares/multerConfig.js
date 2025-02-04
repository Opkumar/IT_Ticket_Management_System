const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

// Multer Storage with Cloudinary
const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "usersImage", // Change folder name if needed
    format: async (req, file) => "png", // Convert all uploads to PNG
    public_id: (req, file) => file.originalname.split(".")[0], // Keep original filename
  },
});
const ticketStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ticketsImage", // Change folder name if needed
    format: async (req, file) => "png", // Convert all uploads to PNG
    public_id: (req, file) => file.originalname.split(".")[0], // Keep original filename
  },
});

const UserUpload = multer({ storage: userStorage }).single("userImage");
const ticketUpload = multer({ storage: ticketStorage }).single("ticketImage");

module.exports = { UserUpload, ticketUpload };
