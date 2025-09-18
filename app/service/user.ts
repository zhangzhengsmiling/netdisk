import { Service } from 'egg';

export default class UserService extends Service {
  /**
   * 创建用户
   * @param payload 用户信息
   */
  public async create(payload: {
    username: string;
    email: string;
    password: string;
  }) {
    // const { ctx } = this;
    // return ctx.model.User.create(payload);
    return {
      _id: '1',
      ...payload,
    };
  }

  /**
   * 根据邮箱查找用户
   * @param email 邮箱
   */
  public async findByEmail(
    // email: string
  ) {
    // const { ctx } = this;
    // return ctx.model.User.findOne({ email }).select('+password');
    return null;
  }

  /**
   * 查找用户信息
   * @param id 用户ID
   */
  public async findById(id: string) {
    // const { ctx } = this;
    // return ctx.model.User.findById(id);
    return {
      _id: id,
      username: 'test',
      email: 'test@example.com',
    };
  }

  /**
   * 生成Token
   * @param payload Token载荷
   */
  public async createToken(payload: { id: string }) {
    const { app } = this;
    return app.jwt.sign(payload, app.config.jwt.secret, {
      expiresIn: app.config.jwt.expiresIn,
    });
  }

  /**
   * 验证Token
   * @param token JWT Token
   */
  public async verifyToken(token: string) {
    const { app } = this;
    return app.jwt.verify(token, app.config.jwt.secret);
  }
}