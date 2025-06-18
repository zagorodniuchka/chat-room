import express from 'express';
import dotenv from 'dotenv';
import wss from 'ws';
import messageRoutes from './routes/messages.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/messages', messageRoutes);
app.get('/', (req, res) => {
    res.send('HTTP сервер живой и здоровый!');
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
