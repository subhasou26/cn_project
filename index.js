// server.js (Backend)
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = {}; // Store clients with their userId

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'register') {
            clients[data.userId] = ws;
            console.log(`User ${data.userId} connected`);
        } else if (data.type === 'message' && clients[data.to]) {
            clients[data.to].send(JSON.stringify({ from: data.from, message: data.message }));
        }
    });

    ws.on('close', () => {
        for (let userId in clients) {
            if (clients[userId] === ws) {
                delete clients[userId];
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
