import { request } from '@/utils/request';

interface FileInfo {
  name: string;
  path: string;
  size: number;
  isDirectory: boolean;
  createdAt: string;
  modifiedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// 获取文件列表
export async function getFileList(dir: string): Promise<FileInfo[]> {
  const response = await request<ApiResponse<FileInfo[]>>(`/api/v1/file/list?dir=${encodeURIComponent(dir)}`, {
    method: 'GET',
  });
  return response.data || [];
}

// 创建目录
export async function createDirectory(dir: string): Promise<void> {
  await request<ApiResponse<void>>('/api/v1/file/mkdir', {
    method: 'POST',
    data: { dir },
  });
}

// 上传文件
export async function uploadFile(dir: string, file: File): Promise<{ path: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('dir', dir);

  console.log(formData.get('dir'))

  const response = await request<ApiResponse<{ path: string }>>('/api/v1/file/upload', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data!;
}

// 下载文件
export async function downloadFile(filepath: string): Promise<Blob> {
  return request<Blob>(`/api/v1/file/download?filepath=${encodeURIComponent(filepath)}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// 删除文件
export async function deleteFile(filepath: string): Promise<void> {
  await request<ApiResponse<void>>('/api/v1/file/delete', {
    method: 'POST',
    data: { filepath },
  });
}