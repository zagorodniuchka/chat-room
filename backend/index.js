import express from 'express';
import dotenv from 'dotenv';
import messageRoutes from './routes/messages.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/messages', messageRoutes);

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
});
