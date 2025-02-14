import { Socket } from 'socket.io-client';
import { WelcomeMessage } from '@/components/WelcomeMessage';
import MainLayout from '@/pages/MainLayout';

export default function Home({ socket }: { socket: Socket }) {
  return <MainLayout element={<WelcomeMessage socket={socket} />} />;
}
