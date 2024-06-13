import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import router from './routes/index.js';

const app = express();

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/v1', router)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));