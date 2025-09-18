import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as path from 'path';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1708330321749_7453';

  // add your egg config in here
  config.middleware = [];

  // 安全配置
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // MongoDB配置
  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/netdisk',
    options: {
      useUnifiedTopology: true,
    },
  };

  // JWT配置
  config.jwt = {
    secret: 'your-jwt-secret',
    expiresIn: '7d', // token有效期为7天
  };

  // 网盘配置
  config.netdisk = {
    root: path.join(appInfo.baseDir, 'storage'), // 网盘根目录
    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip', 'rar'], // 允许的文件类型
    maxFileSize: 100 * 1024 * 1024, // 最大文件大小（100MB）
  };

  // 文件上传配置
  config.multipart = {
    mode: 'file',
    fileSize: '100mb',
    whitelist: [
      '.jpg', '.jpeg', '.png', '.gif',
      '.pdf', '.doc', '.docx',
      '.xls', '.xlsx',
      '.txt',
      '.zip', '.rar'
    ],
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
