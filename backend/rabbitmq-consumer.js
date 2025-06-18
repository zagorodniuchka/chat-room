import amqp from 'amqplib';
import pool from './db.js';
import dotenv from 'dotenv';
dotenv.config();

async function consumeMessages() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = 'messages';
        await channel.assertQueue(queue, { durable: true });
        console.log('Ожидание сообщений в RabbitMQ...');

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());
                try {
                    await pool.query(
                        'INSERT INTO messages (sender, content, is_read) VALUES ($1, $2, $3)',
                        [message.sender, message.content, message.is_read || false]
                    );
                    console.log('Сообщение сохранено в базе:', message);
                    channel.ack(msg);
                } catch (err) {
                    console.error('Ошибка при сохранении в базу:', err.message);
                }
            }
        }, { noAck: false });
    } catch (err) {
        console.error('Ошибка RabbitMQ:', err.message);
    }
}

consumeMessages();