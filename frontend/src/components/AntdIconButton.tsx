import { Button } from 'antd';

interface AntdIconButtonProps {
  children: React.ReactNode;
  position: 'start' | 'end';
  icon: React.ReactNode;
  type: 'button' | 'submit' | 'reset' | undefined;
  onClick: () => void;
}

export function AntdIconButton({ children, position, icon, type, onClick }: AntdIconButtonProps) {
  return (
    <Button type="primary" icon={icon} iconPosition={position} htmlType={type} onClick={onClick}>
      {children}
    </Button>
  );
}
