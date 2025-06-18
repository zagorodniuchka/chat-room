import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import messageRoutes from './routes/messages.js';

dotenv.config();

const app = express();

// Configure CORS for localhost:3001
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // If you need cookies or auth headers
}));
app.use(express.json());
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.send('HTTP сервер живой и здоровый!');
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});