import express from 'express';
import uploadRoutes from './uploadRoutes.js';


const indexRouter = express.Router();


indexRouter.use('/api/upload', uploadRoutes);


export default indexRouter;