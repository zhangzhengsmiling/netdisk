import { Controller } from 'egg';
import { FileSystem } from 'netdisk_base';
import * as path from 'path';

// interface FileUploadResult {
//   filepath: string;
//   filename: string;
// }

export default class FileController extends Controller {
  private fileSystem: FileSystem;

  constructor(ctx) {
    super(ctx);
    // 从配置中获取网盘根目录
    const rootDir = this.config.netdisk.root;
    this.fileSystem = new FileSystem(rootDir);
  }

  /**
   * 获取目录内容
   */
  public async list() {
    const { ctx } = this;
    const { dir = '/' } = ctx.query;

    try {
      const files = await this.fileSystem.readDirectory(dir);
      ctx.body = {
        success: true,
        data: files
      };
    } catch (error: unknown) {
      const err = error as Error;
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: err.message
      };
    }
  }

  /**
   * 创建目录
   */
  public async createDirectory() {
    const { ctx } = this;
    const { dir } = ctx.request.body;

    if (!dir) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '目录路径不能为空'
      };
      return;
    }

    try {
      await this.fileSystem.createDirectory(dir);
      ctx.body = {
        success: true
      };
    } catch (error: unknown) {
      const err = error as Error;
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: err.message
      };
    }
  }

  /**
   * 上传文件
   */
  public async upload() {
    const { ctx } = this;
    const { dir = '/' } = ctx.request.body;
    const file = ctx.request.files?.[0];

    console.log(ctx.request, file, 'req...')

    if (!file) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '未找到上传的文件'
      };
      return;
    }

    try {
      const targetPath = path.join(dir, file.filename);
      const fileContent = await ctx.helper.readFile(file.filepath);
      await this.fileSystem.writeFile(targetPath, fileContent);

      ctx.body = {
        success: true,
        data: {
          path: targetPath
        }
      };
    } catch (error: unknown) {
      const err = error as Error;
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: err.message
      };
    } finally {
      // 清理临时文件
      await ctx.helper.removeFile(file.filepath);
    }
  }

  /**
   * 下载文件
   */
  public async download() {
    const { ctx } = this;
    const { filepath } = ctx.query;

    if (!filepath) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '文件路径不能为空'
      };
      return;
    }

    try {
      const fileContent = await this.fileSystem.readFile(filepath);
      const stats = await this.fileSystem.stat(filepath);
      
      ctx.set('Content-Type', 'application/octet-stream');
      ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent(path.basename(filepath))}`);
      ctx.set('Content-Length', stats.size.toString());
      ctx.body = fileContent;
    } catch (error: unknown) {
      const err = error as Error;
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: err.message
      };
    }
  }

  /**
   * 删除文件或目录
   */
  public async delete() {
    const { ctx } = this;
    const { filepath } = ctx.request.body;

    if (!filepath) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: '文件路径不能为空'
      };
      return;
    }

    try {
      await this.fileSystem.delete(filepath);
      ctx.body = {
        success: true
      };
    } catch (error: unknown) {
      const err = error as Error;
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: err.message
      };
    }
  }
}