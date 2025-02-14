import { Layout, Menu } from 'antd';
import { WaveChatLogo } from '@/components/WaveChatLogo';

const { Header, Content, Footer } = Layout;

export default function MainLayout({ element }: { element: React.ReactElement }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <a href="/">
          <WaveChatLogo />
        </a>
        <Menu theme="dark" mode="horizontal" style={{ flex: 1, minWidth: 0 }} />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <div style={{}} className="bg-white min-h-[280px] lg:p-24 border-radius-10">
          {element}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Made with love, by Charlie</Footer>
    </Layout>
  );
}
