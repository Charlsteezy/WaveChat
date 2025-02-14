import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer } from 'socket.io';

import CONFIG from './config';

interface RoomData {
  roomId: string;
  users: { userName: string; userId: string }[];
}

interface UserJoinData {
  userData: {
    name: string;
    id: string;
    imageUrl: string;
  },
  roomId: string;
}

interface Message {
  message: string;
  userId: string;
  userName: string;
  profileImageUrl: string;
  type: string;
  sent: Date;
}

const app = express();
const router = express.Router();

const httpServer = http.createServer(http);
const io = new IOServer(httpServer);

app.use(router);
app.use(cors({ origin: '*' }));

const connectedUsers = {};

const currentRooms = [];

io.on('connection', (socket) => {

  socket.on('room-created', (roomData: RoomData) => {
    currentRooms[roomData.roomId] = { users: [] };
    io.emit('room-created', roomData);
  });

  socket.on('user-joined', (userData: UserJoinData) => {
    socket.join(userData.roomId);
    connectedUsers[socket.id] = { ...userData, socketId: socket.id };
    if (!currentRooms[userData.roomId]) {
      io.to(userData.roomId).emit('room-not-found');
      return;
    }

    currentRooms[userData.roomId].users.push({ userName: userData.userData.name, userId: userData.userData.id });

    io.to(userData.roomId).emit('user-joined-chat', userData);
    io.to(userData.roomId).emit('update-current-users', currentRooms[userData.roomId].users);
  });

  socket.on("message", (messageData: Message, roomId: string) => {
    if (!roomId) return;
    if (!messageData.userName) return;
    io.to(roomId).emit("message", messageData);
  });

  socket.on("disconnect", () => {

    connectedUsers[socket.id] && io.to(connectedUsers[socket.id].roomId).emit("user-left", connectedUsers[socket.id].userData.name);

    if (!connectedUsers[socket.id]) return;
    delete currentRooms[connectedUsers[socket.id].roomId];
    delete connectedUsers[socket.id];
  });
});

httpServer.listen(CONFIG.PORT, () => {
  console.log(`Server listening on *:${CONFIG.PORT} 🚀`);
});
