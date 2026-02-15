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

// Настройка WebSocket сервера
const wss = new WebSocketServer({ server });
const tiktokConnections = new Map();

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'connect' && data.username) {
        const username = data.username;
        console.log(`Request to track: ${username}`);

        let tiktokConn = tiktokConnections.get(username);

        if (!tiktokConn) {
          tiktokConn = new WebcastPushConnection(username);
          
          tiktokConn.connect()
            .then(state => console.info(`Connected to ${username} (Room: ${state.roomId})`))
            .catch(err => {
              console.error(`Failed to connect to ${username}:`, err);
              // Можно отправить ошибку клиенту, если нужно
            });

          // Обработка Лайков
          tiktokConn.on('like', (data) => {
            broadcast({
              type: 'like',
              targetUser: username,
              nickname: data.nickname,
              profilePictureUrl: data.profilePictureUrl,
              likeCount: data.likeCount
            });
          });

          // Обработка Подарков
          tiktokConn.on('gift', (data) => {
            // Отправляем только если это не конец стрика (или можно отправлять все)
            broadcast({
              type: 'gift',
              targetUser: username,
              nickname: data.nickname,
              profilePictureUrl: data.profilePictureUrl,
              giftName: data.giftName,
              giftPictureUrl: data.giftPictureUrl,
              repeatCount: data.repeatCount,
              diamondCount: data.diamondCount
            });
          });

          tiktokConnections.set(username, tiktokConn);
        }
      }
    } catch (e) {
      console.error('WS Message Error:', e);
    }
  });
});

function broadcast(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(payload);
  });
}

// Раздача статических файлов (React App)
app.use(express.static(path.join(__dirname, 'dist')));

// Любой маршрут возвращает index.html (для React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
