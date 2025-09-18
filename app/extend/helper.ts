import { readFile, unlink } from 'fs/promises';

export default {
  /**
   * 读取文件内容
   * @param filepath 文件路径
   * @returns 文件内容
   */
  async readFile(filepath: string): Promise<Buffer> {
    return readFile(filepath);
  },

  /**
   * 删除文件
   * @param filepath 文件路径
   */
  async removeFile(filepath: string): Promise<void> {
    try {
      await unlink(filepath);
    } catch (error: unknown) {
      const err = error as { code?: string };
      // 忽略文件不存在的错误
      if (err.code !== 'ENOENT') {
        throw error;
      }
    }
  },
};