import { WebcastPushConnection } from 'tiktok-live-connector';
import { WebSocketServer } from 'ws';
import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const port = process.env.PORT || 8080;

// WebSocket сервер
const wss = new WebSocketServer({ server });

// Хранилище активных подключений к TikTok (чтобы не подключаться дважды к одному юзеру)
const tiktokConnections = new Map();

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      // Когда фронтенд присылает никнейм для отслеживания
      if (data.type === 'connect' && data.username) {
        const username = data.username;
        console.log(`Attempting to connect to TikTok user: ${username}`);

        let tiktokConn = tiktokConnections.get(username);

        if (!tiktokConn) {
          tiktokConn = new WebcastPushConnection(username);
          
          tiktokConn.connect()
            .then(state => console.log(`Connected to ${username} (Room ID: ${state.roomId})`))
            .catch(err => console.error(`Error connecting to ${username}:`, err));

          tiktokConn.on('like', (likeData) => {
            // Рассылаем событие лайка всем клиентам, которые слушают этого юзера
            const payload = JSON.stringify({
              type: 'like',
              targetUser: username,
              nickname: likeData.nickname,
              profilePictureUrl: likeData.profilePictureUrl,
              likeCount: likeData.likeCount
            });

            wss.clients.forEach(client => {
              if (client.readyState === 1) client.send(payload);
            });
          });

          tiktokConnections.set(username, tiktokConn);
        }
      }
    } catch (e) {
      console.error('Invalid WS message', e);
    }
  });

  ws.on('close', () => console.log('Client disconnected'));
});

// Базовый эндпоинт для проверки работы
app.get('/', (req, res) => res.send('TikTok Overlay Server is Running!'));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
