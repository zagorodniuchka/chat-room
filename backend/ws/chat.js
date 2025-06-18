const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log('Новое подключение WebSocket');

    ws.on('message', function incoming(message) {
        console.log('Получено сообщение:', message);

        // Разошлём всем участникам чата
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Пользователь вышел из чата');
    });
});

server.listen(8080, () => {
    console.log('WebSocket сервер слушает на порту 8080');
});
