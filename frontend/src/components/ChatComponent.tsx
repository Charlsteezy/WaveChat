import { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatTextBox } from './ChatTextBox';
import { ChatBubbles } from './ChatBubbles';
import { Message, User } from '@/types';
import { showSuccessNotification, showErrorNotification } from '@/utils/notificationFunctions';
import { Card, Space } from 'antd';

interface ConnectedUsers {
  userId: string;
  userName: string;
}

export default function Chat({ socket }: { socket: Socket }) {
  const [message, setMessage] = useState<string | null>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatActive, setChatActive] = useState<boolean>(false);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUsers[]>([]);
  const params = useParams();
  const navigate = useNavigate();

  const user: User = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.name) {
      navigate(`/?error=no-user`);
    }

    if (!params.userId || !user) {
      navigate(`/?error=no-user`);
    }
    socket.emit('user-joined', {
      userData: user,
      roomId: params.userId
    });
  }, []);

  useEffect(() => {
    const handleMessage = (messageData: Message) => {
      //Add the message to the list of messages
      setMessages((prev) => [...prev, messageData]);
    };

    socket.on('message', handleMessage);

    socket.on('user-joined-chat', (connectedUser) => {
      if (connectedUser.userData.id != params.userId) setChatActive(true);
      if (connectedUser.userData.id === user.id) return;
      setChatActive(true);
      showSuccessNotification({
        messageTitle: `${connectedUser.userData.name} joined the chat!`,
        description: 'You are now ready to chat!',
        placement: 'topRight'
      });
    });

    socket.on('update-current-users', (users: ConnectedUsers[]) => {
      // Update the list of connected users for the 'You're talking to' message
      setConnectedUsers(users);
    });

    socket.on('user-left', (userName: string) => {
      //Handle the case where the user leaves the chat
      setChatActive(false);
      navigate('/');
      socket.emit('terminate-chat');
      showErrorNotification({
        messageTitle: `${userName} left the chat!`,
        description: 'Hope you had a great chat!',
        placement: 'topRight'
      });
    });

    socket.on('room-not-found', () => {
      //Handle the case where the room is not found or doesn't exist
      showErrorNotification({
        messageTitle: 'Room not found or does not exist!',
        description: 'Please create a new room to start a chat!',
        placement: 'topRight'
      });
      navigate('/');
    });

    return () => {
      socket.off('message', handleMessage);
      socket.off('user-joined-chat');
      socket.off('room-not-found');
    };
  }, [socket]);

  const sendMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Create a message object to send to the server to create the message event
    const messageObject = {
      message: message,
      userId: user.id,
      userName: user.name,
      profileImageUrl: user.imageUrl,
      type: 'message',
      sent: new Date()
    };

    if (message) {
      socket.emit('message', messageObject, params.userId);
      //Set the current mesage to an empty string to reset the input box
      setMessage('');
    }
  };

  return (
    <>
      <div className="py-4 px-4">
        <div>
          <a href="/">Leave chat</a>
        </div>
        {chatActive ? (
          <h1 className="text-2xl font-bold">
            You're chatting with{' '}
            {(() => {
              const otherUser = connectedUsers.find((otherUser) => otherUser.userId !== user.id);
              return otherUser ? otherUser.userName : 'no one';
            })()}
          </h1>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <Space direction="vertical" size={16}>
              <Card size="small" title="Invite your friend with this code: " style={{ width: 300 }}>
                <h1 className="text-2xl font-bold text-center">{params.userId}</h1>
              </Card>
            </Space>
            <h1 className="text-2xl font-bold">Waiting for user to join... </h1>
          </div>
        )}
      </div>
      <div
        className="flex flex-col justify-between lg:max-h-[60vh] md:max-h-[60vh] lg:min-h-[50vh] max-h-[80vh] min-h-[80vh]"
        style={{ padding: 20 }}
      >
        <ChatBubbles messages={messages} user={user} />
        <div>
          <ChatTextBox
            setMessage={setMessage}
            sendMessage={sendMessage}
            message={message}
            profileImage={user.imageUrl}
          />
        </div>
      </div>
    </>
  );
}
