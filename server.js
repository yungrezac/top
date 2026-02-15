import { WebcastPushConnection } from 'tiktok-live-connector';
import { WebSocketServer } from 'ws';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// Настройка путей для ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const port = process.env.PORT || 8080;

// WebSocket сервер для связи с браузером
const wss = new WebSocketServer({ server });

// Хранилище активных подключений к TikTok (чтобы не дублировать)
const tiktokConnections = new Map();

// Функция отправки данных всем клиентам
function broadcast(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

wss.on('connection', (ws) => {
  console.log('Frontend connected to WebSocket');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      // Фронтенд просит подключиться к конкретному юзеру
      if (data.type === 'connect' && data.username) {
        const username = data.username;
        
        // Если уже подключены к этому стримеру, ничего не делаем
        if (tiktokConnections.has(username)) {
          console.log(`Already connected to ${username}`);
          return;
        }

        console.log(`Connecting to TikTok Live: ${username}`);
        
        // Создаем подключение через библиотеку
        let tiktokConn = new WebcastPushConnection(username);

        // Обработка подключения
        tiktokConn.connect()
          .then(state => {
            console.info(`Connected to roomId ${state.roomId}`);
          })
          .catch(err => {
            console.error('Failed to connect', err);
            // Удаляем из мапы, чтобы можно было попробовать снова
            tiktokConnections.delete(username);
          });

        // --- СОБЫТИЕ: ЛАЙКИ ---
        tiktokConn.on('like', (data) => {
          broadcast({
            type: 'like',
            targetUser: username,
            nickname: data.nickname,
            profilePictureUrl: data.profilePictureUrl,
            likeCount: data.likeCount,
            totalLikeCount: data.totalLikeCount
          });
        });

        // --- СОБЫТИЕ: ПОДАРКИ ---
        tiktokConn.on('gift', (data) => {
          // data.giftType === 1 (повторяющийся подарок/комбо)
          // Мы отправляем всё, фронтенд сам разберется с комбо
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

        // Обработка отключения стрима
        tiktokConn.on('streamEnd', () => {
          console.log(`Stream ended: ${username}`);
          tiktokConnections.delete(username);
        });

        // Сохраняем подключение
        tiktokConnections.set(username, tiktokConn);
      }
    } catch (e) {
      console.error('WebSocket Error:', e);
    }
  });
});

// 1. Раздаем статические файлы из папки сборки (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// 2. Любой другой запрос возвращает index.html (для React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
