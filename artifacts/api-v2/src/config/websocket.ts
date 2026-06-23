import { WebSocketServer, WebSocket } from 'ws';
import { verifyToken } from '../config/auth.js';
import type { Server } from 'http';

let wss: WebSocketServer | null = null;

export function initWebSocket(server: Server) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    // Проверяем токен из query параметра
    const url = new URL(req.url || '', 'http://localhost');
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(4001, 'Missing token');
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      ws.close(4001, 'Invalid token');
      return;
    }

    // Сохраняем данные пользователя в сокет
    (ws as any).userId = payload.userId;
    (ws as any).role = payload.role;

    ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket connected' }));

    ws.on('close', () => {
      console.log(`User ${payload.userId} disconnected`);
    });
  });

  console.log('WebSocket server started on /ws');
}

// Отправка события всем подключённым клиентам
export function broadcast(event: string, data: any) {
  if (!wss) return;
  const message = JSON.stringify({ type: event, data });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Отправка события конкретному пользователю
export function sendToUser(userId: number, event: string, data: any) {
  if (!wss) return;
  const message = JSON.stringify({ type: event, data });
  wss.clients.forEach((client) => {
    if ((client as any).userId === userId && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
