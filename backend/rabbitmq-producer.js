import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

async function publishMessage(message) {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = 'messages';
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log('Сообщение отправлено в RabbitMQ:', message);
        await channel.close();
        await connection.close();
    } catch (err) {
        console.error('Ошибка RabbitMQ:', err.message);
    }
}

export default publishMessage;