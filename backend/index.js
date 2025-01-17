import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import indexRouter from './routes/indexRouter.js'




const app = express();


app.use(express.json());
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
app.use(cors(corsOptions));


app.use("/", indexRouter);
const PORT = process.env.PORT || 4000;

app.listen(PORT, (error) => {
    if(!error){
        console.log(`server started at http://localhost:${PORT}`);
    }
    else{
        console.log('server starting error', error);
    }
    
})