import express from 'express';
import { upload, uploadMultipleImages } from '../middlewares/multerCloudinary.js';


const uploadRoutes = express.Router();

uploadRoutes.post('/upload-multiple-images', upload.array('images', 10), uploadMultipleImages)


export default uploadRoutes;