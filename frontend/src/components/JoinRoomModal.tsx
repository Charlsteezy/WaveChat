import { useState } from 'react';
import { Input, Modal } from 'antd';
import { AntdIconButton } from './AntdIconButton';
import { ArrowRightOutlined } from '@ant-design/icons';

export function JoinRoomModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    window.location.href = `/chat/${roomCode}`;
  };

  const handleRoomCodeChange = (e: string) => {
    setRoomCode(e);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRoomCode('');
  };

  return (
    <>
      <AntdIconButton type="button" onClick={showModal} icon={<ArrowRightOutlined />} position="end">
        Join chat
      </AntdIconButton>
      <Modal title="Join chat room" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input placeholder="Enter room code" value={roomCode} onChange={(e) => handleRoomCodeChange(e.target.value)} />
      </Modal>
    </>
  );
}
