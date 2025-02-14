import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Server as IOServer } from 'socket.io';
import { createServer } from 'http';
import { io as Client } from 'socket.io-client';
import express from 'express';
import CONFIG from './config';

let io: IOServer;
let server: any;
let clientSocket: any;

beforeEach(async () => {
  // Create Express App and HTTP Server
  const app = express();
  server = createServer(app);

  // Initialize Socket.io Server
  io = new IOServer(server);

  await new Promise<void>((resolve) => {
    server.listen(CONFIG.PORT, resolve);
  });

  // Connect client to the server
  clientSocket = Client(`http://localhost:${CONFIG.PORT}`);
});

afterEach(() => {
  io.close();
  server.close();
  clientSocket.close();
});

describe('Socket.io Server Tests', () => {
  it('should allow a user to create a room', (done: jest.DoneCallback) => {
    clientSocket.emit('room-created', { roomId: '123', users: [] });

    io.on('connection', (socket) => {
      socket.on('room-created', (roomData) => {
        expect(roomData).toEqual({ roomId: '123', users: [] });
        done();
      });
    });
  });

  it('should allow a user to join a room', (done: jest.DoneCallback) => {
    const userJoinData = {
      userData: {
        name: 'John Doe',
        id: 'user-123',
        imageUrl: 'https://example.com/profile.jpg'
      },
      roomId: '123'
    };

    clientSocket.emit('user-joined', userJoinData);

    io.on('connection', (socket) => {
      socket.on('user-joined-chat', (data) => {
        expect(data).toEqual(userJoinData);
        done();
      });
    });
  });

  it('should send a message to a room', (done: jest.DoneCallback) => {
    const messageData = {
      message: 'Hello, world!',
      userId: 'user-123',
      userName: 'John Doe',
      profileImageUrl: 'https://example.com/profile.jpg',
      type: 'text',
      sent: new Date()
    };

    clientSocket.emit('message', messageData, '123');

    io.on('connection', (socket) => {
      socket.on('message', (receivedMessage) => {
        expect(receivedMessage).toEqual(messageData);
        done();
      });
    });
  });

  it('should remove a user when they disconnect', (done: jest.DoneCallback) => {
    const userData = {
      userData: {
        name: 'John Doe',
        id: 'user-123',
        imageUrl: 'https://example.com/profile.jpg'
      },
      roomId: '123'
    };

    clientSocket.emit('user-joined', userData);

    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        socket.emit('user-left', userData.userData.name);
      });

      socket.on('user-left', (userName) => {
        expect(userName).toBe('John Doe');
        done();
      });

      clientSocket.disconnect();
    });
  });
});
