import * as fs from 'fs-extra';
import * as path from 'path';
import pathIsInside from 'path-is-inside';

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  isDirectory: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

export class FileSystem {
  private rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = path.resolve(rootDir);
    this.ensureRoot();
  }

  /**
   * 确保根目录存在
   */
  private ensureRoot(): void {
    if (!fs.existsSync(this.rootDir)) {
      fs.mkdirSync(this.rootDir, { recursive: true });
    }
  }

  /**
   * 验证路径是否在根目录内
   * @param targetPath 目标路径
   * @throws {Error} 如果路径不在根目录内，抛出越权访问错误
   */
  private validatePath(targetPath: string): void {
    const absolutePath = path.resolve(this.rootDir, targetPath);
    if (!pathIsInside(absolutePath, this.rootDir)) {
      throw new Error('越权访问：目标路径不在允许的根目录内');
    }
  }

  /**
   * 获取文件或目录的绝对路径
   * @param relativePath 相对路径
   * @returns 绝对路径
   */
  private getAbsolutePath(relativePath: string): string {
    return path.resolve(this.rootDir, relativePath);
  }

  /**
   * 检查文件或目录是否存在
   * @param relativePath 相对路径
   * @returns 是否存在
   */
  async exists(relativePath: string): Promise<boolean> {
    this.validatePath(relativePath);
    const absolutePath = this.getAbsolutePath(relativePath);
    return fs.pathExists(absolutePath);
  }

  /**
   * 创建目录
   * @param relativePath 相对路径
   */
  async createDirectory(relativePath: string): Promise<void> {
    this.validatePath(relativePath);
    const absolutePath = this.getAbsolutePath(relativePath);
    await fs.ensureDir(absolutePath);
  }

  /**
   * 获取目录内容
   * @param relativePath 相对路径
   * @returns 目录内容列表
   */
  async readDirectory(relativePath: string): Promise<FileInfo[]> {
    this.validatePath(relativePath);
    const absolutePath = this.getAbsolutePath(relativePath);
    const entries = await fs.readdir(absolutePath);
    
    const fileInfos = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(relativePath, entry);
        const stats = await this.stat(entryPath);
        return {
          name: entry,
          path: entryPath,
          size: stats.size,
          isDirectory: stats.isDirectory(),
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      })
    );

    return fileInfos;
  }

  /**
   * 获取文件或目录的详细信息
   * @param relativePath 相对路径
   */
  async stat(relativePath: string): Promise<fs.Stats> {
    this.validatePath(relativePath);
    const absolutePath = this.getAbsolutePath(relativePath);
    return fs.stat(absolutePath);
  }

  /**
   * 读取文件内容
   * @param relativePath 相对路径
   * @returns 文件内容
   */
  async readFile(relativePath: string): Promise<Buffer> {
    this.validatePath(relativePath);
    const absolutePath = this.getAbsolutePath(relativePath);
    const stats = await fs.stat(absolutePath);
    if (stats.isDirectory()) {
      throw new Error('目标路径是一个目录，无法读取文件内容');
    }
    return fs.readFile(absolutePath);
  }

  /**
   * 写入文件
   * @param relativePath 相对路径
   * @param content 文件内容
   */
  async writeFile(relativePath: string, content: Buffer | string): Promise<void> {
    this.validatePath(relativePath);
    const absolutePath = this.getAbsolutePath(relativePath);
    await fs.ensureDir(path.dirname(absolutePath));
    await fs.writeFile(absolutePath, content);
  }

  /**
   * 删除文件或目录
   * @param relativePath 相对路径
   * @param recursive 是否递归删除（用于目录）
   */
  async delete(relativePath: string, recursive = true): Promise<void> {
    this.validatePath(relativePath);
    const absolutePath = this.getAbsolutePath(relativePath);
    const stats = await fs.stat(absolutePath);

    if (stats.isDirectory() && !recursive) {
      throw new Error('目标是非空目录，需要设置recursive参数为true才能删除');
    }

    await fs.remove(absolutePath);
  }

  /**
   * 移动文件或目录
   * @param sourceRelativePath 源路径
   * @param targetRelativePath 目标路径
   */
  async move(sourceRelativePath: string, targetRelativePath: string): Promise<void> {
    this.validatePath(sourceRelativePath);
    this.validatePath(targetRelativePath);
    
    const sourceAbsolutePath = this.getAbsolutePath(sourceRelativePath);
    const targetAbsolutePath = this.getAbsolutePath(targetRelativePath);

    await fs.move(sourceAbsolutePath, targetAbsolutePath, { overwrite: true });
  }
}