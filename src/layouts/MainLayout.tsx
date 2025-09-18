import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { FolderOutlined, CloudUploadOutlined, ShareAltOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'files',
      icon: <FolderOutlined />,
      label: '我的文件',
    },
    {
      key: 'upload',
      icon: <CloudUploadOutlined />,
      label: '文件上传',
    },
    {
      key: 'share',
      icon: <ShareAltOutlined />,
      label: '我的分享',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontSize: '20px' }}>网盘系统</div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['files']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={({ key }) => navigate(`/${key}`)}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;