import { WebcastPushConnection } from 'tiktok-live-connector';
import { WebSocketServer } from 'ws';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const port = process.env.PORT || 8080;

// WebSocket сервер
const wss = new WebSocketServer({ server });

// Хранилище активных подключений к TikTok
const tiktokConnections = new Map();

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      // Клиент запрашивает подключение к стримеру
      if (data.type === 'connect' && data.username) {
        const username = data.username;
        console.log(`Request to track: ${username}`);

        let tiktokConn = tiktokConnections.get(username);

        // Если подключения нет, создаем новое
        if (!tiktokConn) {
          tiktokConn = new WebcastPushConnection(username);
          
          tiktokConn.connect()
            .then(state => {
              console.info(`Connected to roomId ${state.roomId} (${username})`);
            })
            .catch(err => {
              console.error('Failed to connect', err);
            });

          // Слушаем лайки
          tiktokConn.on('like', (likeData) => {
            const payload = JSON.stringify({
              type: 'like',
              targetUser: username,
              nickname: likeData.nickname,
              profilePictureUrl: likeData.profilePictureUrl,
              likeCount: likeData.likeCount
            });
            
            // Рассылаем всем клиентам
            wss.clients.forEach(client => {
              if (client.readyState === 1) client.send(payload);
            });
          });

          // Можно добавить обработку подарков, чата и т.д. здесь же

          tiktokConnections.set(username, tiktokConn);
        }
      }
    } catch (e) {
      console.error('WebSocket Error:', e);
    }
  });
});

// 1. Раздача статики (React build)
app.use(express.static(path.join(__dirname, 'dist')));

// 2. Catch-all маршрут для поддержки путей типа /username
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
