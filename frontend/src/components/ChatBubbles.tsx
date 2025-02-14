import { Message, User } from '../types';
import { Avatar } from 'antd';

export function ChatBubbles({ messages, user }: { messages: Message[]; user: User }) {
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      {messages.map((message: Message, index) => (
        <div key={index}>
          {message.userId === user.id ? (
            <div className="flex flex-col ml-auto max-w-[75%] w-[fit-content] text-right">
              <p>You</p>
              <div className="flex gap-2">
                <div className="bg-blue-500 text-white p-3 rounded-lg">
                  <p>{message.message}</p>
                </div>
                <Avatar src={message.profileImageUrl} />
              </div>
              <p>{new Date(message.sent).toLocaleTimeString()}</p>
            </div>
          ) : (
            <div className="flex flex-col">
              <p>{message.userName}</p>
              <div className="flex gap-2">
                <Avatar src={message.profileImageUrl} />
                <div className="bg-gray-200 text-black p-3 rounded-lg max-w-[75%] w-[fit-content]">
                  <p>{message.message}</p>
                </div>
              </div>
              <p>{new Date(message.sent).toLocaleTimeString()}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
