import { Table, Button, Space } from 'antd';
import { DownloadOutlined, DeleteOutlined, ShareAltOutlined } from '@ant-design/icons';

const Files = () => {
  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '修改时间',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<DownloadOutlined />}>下载</Button>
          <Button type="link" icon={<ShareAltOutlined />}>分享</Button>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: '示例文档.docx',
      size: '2.5MB',
      modifiedTime: '2024-03-14 10:30:00',
    },
    {
      key: '2',
      name: '项目计划.xlsx',
      size: '1.8MB',
      modifiedTime: '2024-03-13 15:45:00',
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Files;