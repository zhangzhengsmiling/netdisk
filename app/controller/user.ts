import { Context, Controller } from 'egg';

class ContextResponse {
  private context: Context;
  constructor(context: Context) {
    this.context = context
  }

  public sendError(error: string, status = 400) {
    this.context.status = status;
    this.context.body = {
      success: false,
      error,
    };
  }

  public sendSuccess(data: any, status = 200) {
    this.context.status = status;
    this.context.body = {
      success: true,
      data,
    };
  }
}

export default class UserController extends Controller {
  public async register() {
    const { ctx } = this;
    const contextResponse = new ContextResponse(ctx);
    const { username, email, password } = ctx.request.body;
    if (!username || !email || !password) return contextResponse.sendError('请提供用户名、邮箱和密码', 400)
    const user = await ctx.service.user.create({
      username,
      email,
      password,
    });

    // 生成token
    const token = await ctx.service.user.createToken({ id: user.id });
    contextResponse.sendSuccess({ token });
  }

  public async login() {
    const { ctx } = this;
    const { email, password } = ctx.request.body;
    const contextResponse = new ContextResponse(ctx);
    // 参数验证
    if (!email || !password) contextResponse.sendError('请提供邮箱和密码', 400)
    const user = await ctx.service.user.findByEmail(email);
    if (!user) return contextResponse.sendError('用户不存在', 401)
    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return contextResponse.sendError('密码错误', 401)
    // 生成token
    const token = await ctx.service.user.createToken({ id: user.id });
    contextResponse.sendSuccess({ token })
  }

  public async getCurrentUser() {
    const { ctx } = this;
    const contextResponse = new ContextResponse(ctx);
    const user = await ctx.service.user.findById(ctx.state.user.id);
    contextResponse.sendSuccess(user)
  }
}