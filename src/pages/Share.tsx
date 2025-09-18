import { Table, Button, Tag } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';

const Share = () => {
  const columns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: '分享链接',
      dataIndex: 'shareLink',
      key: 'shareLink',
      render: (text: string) => (
        <Button 
          type="link" 
          icon={<CopyOutlined />}
          onClick={() => navigator.clipboard.writeText(text)}
        >
          复制链接
        </Button>
      ),
    },
    {
      title: '分享时间',
      dataIndex: 'shareTime',
      key: 'shareTime',
    },
    {
      title: '过期时间',
      dataIndex: 'expireTime',
      key: 'expireTime',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => {
        let color = status === '有效' ? 'green' : 'red';
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" danger icon={<DeleteOutlined />}>
          取消分享
        </Button>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      fileName: '示例文档.docx',
      shareLink: 'https://share.example.com/abc123',
      shareTime: '2024-03-14 10:30:00',
      expireTime: '2024-03-21 10:30:00',
      status: '有效',
    },
    {
      key: '2',
      fileName: '项目计划.xlsx',
      shareLink: 'https://share.example.com/def456',
      shareTime: '2024-03-13 15:45:00',
      expireTime: '2024-03-20 15:45:00',
      status: '有效',
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Share;