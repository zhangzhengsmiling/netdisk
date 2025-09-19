import { Layout, Menu, message } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { FolderOutlined, CloudUploadOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useGlobalStore } from '@/store';
import { useMount } from 'ahooks';

const { Header, Content, Sider } = Layout;

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

const MainLayout = () => {
  const navigate = useNavigate();

  const globalStore = useGlobalStore();
  const { user } = globalStore;
  useMount(() => {
    user.getUser()
  })

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: '#fff', fontSize: '20px' }}>网盘系统</div>
        <div style={{ color: '#fff', cursor: 'pointer' }} onClick={() => {
          user.logout();
          message.success('退出登录成功');
          navigate('/login')
        }}>退出登录</div>
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