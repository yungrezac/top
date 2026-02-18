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
// Ключ: username, Значение: { conn: WebcastPushConnection, active: boolean, retryTimer: timeoutId }
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

// Функция подключения к TikTok с авто-реконнектом
function connectToTikTok(username) {
  // Если уже есть активное соединение, выходим
  if (tiktokConnections.has(username) && tiktokConnections.get(username).active) {
    return;
  }

  console.log(`[TikTok] Attempting to connect to ${username}...`);

  const tiktokConn = new WebcastPushConnection(username, {
    processInitialData: false,
    enableExtendedGiftInfo: true,
    requestPollingIntervalMs: 2000,
    clientParams: {
      app_language: 'en-US',
      device_platform: 'web'
    }
  });

  tiktokConn.connect()
    .then(state => {
      console.info(`[TikTok] Connected to roomId ${state.roomId} for user ${username}`);
      
      // Сохраняем успешное соединение
      tiktokConnections.set(username, { 
        conn: tiktokConn, 
        active: true, 
        retryTimer: null 
      });
    })
    .catch(err => {
      console.error(`[TikTok] Failed to connect to ${username}:`, err.message);
      // Если не удалось подключиться (стрим офлайн или ошибка), пробуем снова через 10 сек
      scheduleRetry(username);
    });

  // --- СОБЫТИЯ ---

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

  tiktokConn.on('gift', (data) => {
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

  // Стрим закончился - сбрасываем данные и удаляем соединение
  tiktokConn.on('streamEnd', () => {
    console.log(`[TikTok] Stream ended: ${username}`);
    broadcast({ type: 'streamEnd', targetUser: username });
    
    // Удаляем из активных, чтобы при следующем запросе попробовать снова
    // Или можно оставить retry loop, если ожидается перезапуск
    cleanupConnection(username);
    scheduleRetry(username); // Продолжаем мониторить, вдруг запустят снова
  });

  // Обрыв соединения со стороны библиотеки
  tiktokConn.on('disconnected', () => {
    console.log(`[TikTok] Disconnected from ${username}`);
    cleanupConnection(username);
    scheduleRetry(username);
  });

  tiktokConn.on('error', (err) => {
    console.error(`[TikTok] Error for ${username}:`, err);
    // Ошибки соединения часто фатальны для текущего инстанса
    cleanupConnection(username);
    scheduleRetry(username);
  });
}

// Планировщик повторного подключения
function scheduleRetry(username) {
  if (tiktokConnections.has(username) && tiktokConnections.get(username).retryTimer) {
    return; // Таймер уже запущен
  }

  console.log(`[TikTok] Scheduling retry for ${username} in 10s...`);
  const timer = setTimeout(() => {
    // Очищаем старую запись перед новой попыткой, но сохраняем намерение
    cleanupConnection(username); 
    connectToTikTok(username);
  }, 10000);

  tiktokConnections.set(username, { 
    conn: null, 
    active: false, 
    retryTimer: timer 
  });
}

function cleanupConnection(username) {
  const existing = tiktokConnections.get(username);
  if (existing) {
    if (existing.conn) {
      try { existing.conn.disconnect(); } catch (e) {}
    }
    if (existing.retryTimer) {
      clearTimeout(existing.retryTimer);
    }
    tiktokConnections.delete(username);
  }
}

// --- WS HANDLER ---

wss.on('connection', (ws) => {
  console.log('[Client] Frontend connected to WebSocket');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      // Фронтенд просит подключиться к конкретному юзеру
      if (data.type === 'connect' && data.username) {
        const username = data.username;
        // Запускаем процесс подключения к TikTok (если еще не запущен)
        connectToTikTok(username);
      }
    } catch (e) {
      console.error('WebSocket Error:', e);
    }
  });

  ws.on('close', () => {
    console.log('[Client] Frontend disconnected');
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
