import { Context } from 'egg';

export default () => {
  return async function auth(ctx: Context, next: () => Promise<any>) {
    let token = '';

    if (ctx.headers.authorization && ctx.headers.authorization.startsWith('Bearer')) {
      token = ctx.headers.authorization.split(' ')[1];
    }

    if (!token) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: '未授权访问',
      };
      return;
    }

    try {
      // 验证token
      const decoded = await ctx.service.user.verifyToken(token);
      ctx.state.user = decoded;
      await next();
    } catch (err) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: 'Token无效',
      };
    }
  };
};