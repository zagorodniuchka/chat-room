import React, { useState, useEffect, useRef } from 'react';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onopen = () => {
            console.log('WS подключение установлено');
        };

        ws.current.onmessage = (event) => {
            setMessages(prev => [...prev, event.data]);
        };

        ws.current.onclose = () => {
            console.log('WS подключение закрыто');
        };

        return () => {
            ws.current.close();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            ws.current.send(input);
            setMessages(prev => [...prev, `Я: ${input}`]);
            setInput('');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <h3>Чат по WebSocket</h3>
            <div style={{
                border: '1px solid #ccc',
                height: 300,
                overflowY: 'auto',
                padding: 10,
                marginBottom: 10
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ margin: '5px 0' }}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if(e.key === 'Enter') sendMessage() }}
                style={{ width: '80%', marginRight: 8 }}
            />
            <button onClick={sendMessage}>Отправить</button>
        </div>
    );
}
