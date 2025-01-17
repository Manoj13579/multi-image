import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import cloudinary from '../config/cloudinary.js';

/* 2nd hit. CloudinaryStorage serves as a storage engine for Multer, meaning it handles the specifics of where and how to store files uploaded through HTTP requests.*/
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    // save in this folder in cloudinary. although also saved in Assets in cloudinary but uses only one space per image.
    folder: 'multi-image',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    filename: (req, file) => {
      // Giving name to uploaded file using Date.now for uniqueness
      return `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
    },
  },
});

// 1st hit. multer middleware.
export const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, /* 1 MB file size limit. applies to each individual file in the array, not the total size of all files combined.*/
});

/* third hit. This is a controller but kept here for simplicity. uploaded to cloudinary. receives files from const storage. no need to delete files after upload. multer-storage-cloudinary does automatically */
export const uploadMultipleImages = async (req, res) => {
  console.log('uploadMultipleImages hit', req.files);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    // using multer-storage-cloudinary doesn't return public_id to delete in req.files. to delete use ecommerce approach
    // contains more than 1 file so map used
    /* map() method creates the uploadedFiles array dynamically based on req.files which is an array of uploaded files. array used in uploadRoutes from there goes to storage and then cloudinary returns as array   */
    const uploadedFiles = req.files.map(file => ({
      path: file.path,
      originalName: file.originalname,
    }));

    return res.status(200).json({
      success: true,
      message: 'Files uploaded to Cloudinary successfully',
      data: uploadedFiles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
};
