import { Application } from 'egg';

export default (app: Application) => {
  const { controller } = app;
  
  // 用户认证路由
  app.router.post('/api/v1/auth/register', controller.user.register);
  app.router.post('/api/v1/auth/login', controller.user.login);
  app.router.get('/api/v1/auth/me', app.middleware.auth(), controller.user.getCurrentUser);

  // 文件操作路由
  app.router.get('/api/v1/file/list', controller.file.list);
  app.router.post('/api/v1/file/mkdir', controller.file.createDirectory);
  app.router.post('/api/v1/file/upload', controller.file.upload);
  app.router.get('/api/v1/file/download', controller.file.download);
  app.router.post('/api/v1/file/delete', controller.file.delete);
};