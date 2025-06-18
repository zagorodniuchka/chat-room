import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import { createServer } from 'http';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const server = createServer();
const wss = new WebSocketServer({ server });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),  // <-- порт должен быть 5433 в .env
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

wss.on('connection', (ws) => {
    console.log('Новое подключение WebSocket');

    ws.on('message', async (message) => {
        console.log('Получено сообщение:', message.toString());
        try {
            const messageObj = JSON.parse(message.toString());
            const { sender, content } = messageObj;

            if (!sender || !content) {
                throw new Error('Invalid message format');
            }

            await pool.query(
                'INSERT INTO messages (sender, content, is_read) VALUES ($1, $2, $3)',
                [sender, content, false]
            );

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(messageObj));
                }
            });
        } catch (err) {
            console.error('Ошибка при сохранении сообщения:', err.message);
            console.error(err);
        }
    });

    ws.on('close', () => {
        console.log('Пользователь вышел из чата');
    });
});

server.listen(8080, () => {
    console.log('WebSocket сервер слушает на порту 8080');
});
