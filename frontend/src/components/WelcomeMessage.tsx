import { Socket } from 'socket.io-client';
import { CreateNameForm } from './CreateNameForm';
import { useState } from 'react';
import { User } from '@/types';
import { AntdIconButton } from './AntdIconButton';
import { ArrowRightOutlined } from '@ant-design/icons';
import { JoinRoomModal } from './JoinRoomModal';

export function WelcomeMessage({ socket }: { socket: Socket }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  });

  function handleRoomCreate() {
    socket.emit('room-created', { roomId: user?.id, users: { userName: user?.name } });
    window.location.href = `/chat/${user?.id}`;
  }

  return (
    <div className="mx-auto max-w-7xl lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-26">
        <div className="text-center">
          {user ? (
            <div className="mt-6">
              <h1 className="text-balance text-5xl font-semibold tracking-tight text-black sm:text-7xl whitespace-nowrap">
                Hi, {user.name}!
              </h1>
              <p className="mt-8 text-pretty text-lg font-medium text-gray-400 sm:text-xl/8">
                Let's get chatting! WaveChat is super easy to use, just create a room and share the code with your
                friend.
              </p>
              <div className="flex flex-col lg:flex-row lg:gap-x-4 lg:align-middle lg:justify-center gap-y-4 mt-10 my-10 mx-10">
                <AntdIconButton
                  icon={<ArrowRightOutlined />}
                  position={'end'}
                  type={'button'}
                  onClick={() => {
                    handleRoomCreate();
                  }}
                >
                  Start chat
                </AntdIconButton>
                <JoinRoomModal />
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  setUser(null);
                }}
                className="text-pretty text-lg font-medium text-gray-400 sm:text-xl/8"
              >
                {' '}
                Log out{' '}
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-balance text-2xl md:text-4xl lg:text-7xl font-semibold tracking-tight text-black lg:whitespace-nowrap">
                Welcome to WaveChat!
              </h1>
              <p className="mt-8 text-pretty text-lg font-medium text-gray-400 sm:text-xl/8">
                Let's get started, shall we? May I get your name?
              </p>
              <div className="mt-10 px-15 flex flex-col items-center justify-center gap-x-6 gap-y-6">
                <CreateNameForm setCurrentUser={setUser} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
