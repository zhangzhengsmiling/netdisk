import { Context } from 'egg';

interface CustomError extends Error {
  status?: number;
  errors?: any;
}

export default () => {
  return async function errorHandler(ctx: Context, next: () => Promise<any>) {
    try {
      await next();
    } catch (err) {
      const error = err as CustomError;
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', error, ctx);

      const status = error.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const message = status === 500 && ctx.app.config.env === 'prod'
        ? '服务器内部错误'
        : error.message;

      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = { success: false, error: message };
      if (status === 422) {
        ctx.body.detail = error.errors;
      }
      ctx.status = status;
    }
  };
};