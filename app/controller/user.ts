import { Controller } from 'egg';

export default class UserController extends Controller {
  public async register() {
    const { ctx } = this;
    const { username, email } = ctx.request.body;

    // // 创建用户
    // const user = await ctx.service.user.create({
    //   username,
    //   email,
    //   password,
    // });

    // 临时用户数据
    const user = {
      _id: '1',
      username,
      email,
    };

    // 生成token
    const token = await ctx.service.user.createToken({ id: user._id });

    ctx.body = {
      success: true,
      token,
    };
  }

  public async login() {
    const { ctx } = this;
    const { email, password } = ctx.request.body;

    // 参数验证
    if (!email || !password) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: '请提供邮箱和密码',
      };
      return;
    }

    // // 查找用户
    // const user = await ctx.service.user.findByEmail(email);
    // if (!user) {
    //   ctx.status = 401;
    //   ctx.body = {
    //     success: false,
    //     error: '用户不存在',
    //   };
    //   return;
    // }

    // // 验证密码
    // const isMatch = await user.comparePassword(password);
    // if (!isMatch) {
    //   ctx.status = 401;
    //   ctx.body = {
    //     success: false,
    //     error: '密码错误',
    //   };
    //   return;
    // }

    // 临时用户数据
    const user = {
      _id: '1',
      email,
    };

    // 生成token
    const token = await ctx.service.user.createToken({ id: user._id });

    ctx.body = {
      success: true,
      token,
    };
  }

  public async getCurrentUser() {
    const { ctx } = this;
    // const user = await ctx.service.user.findById(ctx.state.user.id);

    // 临时用户数据
    const user = {
      _id: ctx.state.user.id,
      username: 'test',
      email: 'test@example.com',
    };

    ctx.body = {
      success: true,
      data: user,
    };
  }
}