import { Socket } from 'socket.io-client';
import ChatComponent from '@/components/ChatComponent';
import MainLayout from '@/pages/MainLayout';

export default function Chat({ socket }: { socket: Socket }) {
  return <MainLayout element={<ChatComponent socket={socket} />} />;
}
