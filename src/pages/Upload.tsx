import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { uploadFile } from '@/services/file';
import { useState } from 'react';

const { Dragger } = Upload;

const UploadPage = () => {
  const [currentDir] = useState('/');

  const props = {
    name: 'file',
    multiple: true,
    customRequest: async (options: any) => {
      const { file, onSuccess, onError, onProgress } = options;
      try {
        onProgress?.({ percent: 50 });
        const result = await uploadFile('/Users/zhangzheng/code/fe/netdisk/netdisk_backend/storage', file);
        onProgress?.({ percent: 100 });
        onSuccess?.(result);
      } catch (error: any) {
        onError?.(error);
      }
    },
    onChange(info: any) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
    onDrop(e: any) {
      console.log('拖拽上传文件：', e.dataTransfer.files);
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">
          支持单个或批量上传，严禁上传公司内部资料及其他违禁文件
        </p>
      </Dragger>
    </div>
  );
};

export default UploadPage;