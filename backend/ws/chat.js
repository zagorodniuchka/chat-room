import { WebSocketServer } from 'ws';

// Запускаем WS-сервер на порту 8080
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('🧠 Новый клиент подключился');

    // При получении сообщения от клиента
    ws.on('message', (message) => {
        console.log('📨 Сообщение от клиента:', message.toString());

        // Рассылаем всем, кроме отправителя
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === client.OPEN) {
                client.send(message.toString());
            }
        });
    });

    // Приветствуем клиента
    ws.send('👋 Добро пожаловать в WebSocket чат!');
});

export default wss;
