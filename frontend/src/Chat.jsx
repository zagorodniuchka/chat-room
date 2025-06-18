import React, { useState, useEffect, useRef } from 'react';

export default function Chat({ messages, onSendMessage }) {
    const [input, setInput] = useState('');
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const connectWebSocket = () => {
            ws.current = new WebSocket('ws://localhost:8080');
            ws.current.onopen = () => console.log('✅ WebSocket подключен');
            ws.current.onmessage = (event) => {
                console.log('📩 Получено сообщение от сервера:', event.data);
            };
            ws.current.onclose = () => {
                console.log('❌ WebSocket отключен, пытаемся переподключиться...');
                setTimeout(connectWebSocket, 3000); // Retry after 3 seconds
            };
            ws.current.onerror = (err) => console.error('WebSocket ошибка:', err);
        };
        connectWebSocket();
        return () => ws.current.close();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (input.trim()) {
            const message = { sender: 'User', content: input };
            ws.current.send(JSON.stringify(message));
            onSendMessage(message.sender, message.content); // добавляем временно в UI
            setInput('');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
            <div
                style={{
                    flex: 1,
                    border: '1px solid #ccc',
                    overflowY: 'auto',
                    padding: '10px',
                    marginBottom: '10px',
                    backgroundColor: '#f9f9f9',
                }}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id || msg.content + msg.sender}
                        style={{
                            margin: '5px 0',
                            padding: '8px',
                            borderRadius: '8px',
                            backgroundColor: msg.sender === 'User' ? '#e0f7fa' : '#fff',
                            alignSelf: msg.sender === 'User' ? 'flex-end' : 'flex-start',
                            maxWidth: '70%',
                        }}
                    >
                        <strong>{msg.sender}:</strong> {msg.content}{' '}
                        <span>{msg.is_read ? '✅' : '❌'}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                    style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                    placeholder="Введите сообщение..."
                />
                <button
                    onClick={sendMessage}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Отправить
                </button>
            </div>
        </div>
    );
}
