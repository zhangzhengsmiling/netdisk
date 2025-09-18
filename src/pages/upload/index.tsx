import { useRequest } from 'ahooks';
import { Button, Input, Modal, Space, Table, message } from 'antd';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { createDirectory, deleteFile, downloadFile, getFileList, uploadFile } from '@/services/file';
import styles from './index.module.less';

interface FileInfo {
  name: string;
  path: string;
  size: number;
  isDirectory: boolean;
  createdAt: string;
  modifiedAt: string;
}

interface ApiError {
  success: boolean;
  message: string;
}

export default function UploadPage() {
  const [currentDir, setCurrentDir] = useState('');
  const [newDirName, setNewDirName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: files = [], loading, refresh } = useRequest<FileInfo[], any>(
    () => getFileList(currentDir),
    {
      refreshDeps: [currentDir],
    },
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadFile('/Users/zhangzheng/code/fe/netdisk/netdisk_backend/storage', file);
      message.success('上传成功');
      refresh();
    } catch (error: unknown) {
      const err = error as ApiError;
      message.error(err.message || '上传失败');
    }
  };

  const handleCreateDirectory = async () => {
    if (!newDirName) {
      message.error('请输入目录名');
      return;
    }

    try {
      const newDir = currentDir ? `${currentDir}/${newDirName}` : newDirName;
      await createDirectory(newDir);
      message.success('创建成功');
      setNewDirName('');
      setIsModalOpen(false);
      refresh();
    } catch (error: unknown) {
      const err = error as ApiError;
      message.error(err.message || '创建失败');
    }
  };

  const handleDownload = async (filepath: string) => {
    try {
      const blob = await downloadFile(filepath);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filepath.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: unknown) {
      const err = error as ApiError;
      message.error(err.message || '下载失败');
    }
  };

  const handleDelete = async (filepath: string) => {
    try {
      await deleteFile(filepath);
      message.success('删除成功');
      refresh();
    } catch (error: unknown) {
      const err = error as ApiError;
      message.error(err.message || '删除失败');
    }
  };

  const handleDirClick = (path: string) => {
    setCurrentDir(path);
  };

  const handleBack = () => {
    const parts = currentDir.split('/');
    parts.pop();
    setCurrentDir(parts.join('/'));
  };

  const columns: ColumnsType<FileInfo> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: FileInfo) => (
        <span
          className={record.isDirectory ? styles.directory : ''}
          onClick={() => record.isDirectory && handleDirClick(record.path)}
        >
          {name}
        </span>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size: number, record: FileInfo) =>
        record.isDirectory ? '-' : `${(size / 1024).toFixed(2)} KB`,
    },
    {
      title: '修改时间',
      dataIndex: 'modifiedAt',
      key: 'modifiedAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: FileInfo) => (
        <Space size="middle">
          {!record.isDirectory && (
            <>
              <a onClick={() => handleDownload(record.path)}>下载</a>
              <a onClick={() => handleDelete(record.path)}>删除</a>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Space>
          <Button onClick={handleBack} disabled={!currentDir}>
            返回上级
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>新建文件夹</Button>
          <Button>
            <label>
              上传文件
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={handleUpload}
              />
            </label>
          </Button>
        </Space>
        <div>当前目录：{currentDir || '/'}</div>
      </div>

      <Table
        columns={columns}
        dataSource={files}
        loading={loading}
        rowKey="path"
      />

      <Modal
        title="新建文件夹"
        open={isModalOpen}
        onOk={handleCreateDirectory}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="请输入文件夹名称"
          value={newDirName}
          onChange={(e) => setNewDirName(e.target.value)}
        />
      </Modal>
    </div>
  );
}