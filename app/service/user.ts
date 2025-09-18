import UserModel from 'app/model/user';
import { Service } from 'egg';
import * as bcrypt from 'bcryptjs';

// const mapObject =
//   (mapper: (v: any, k: string, obj: Record<string, any>) => { k: string; v: any }) =>
//     (obj: Record<string, any>) =>
//       Object.keys(obj).map((key: string) => mapper(obj[key], key, obj)).reduce((acc, cur) => {
//         acc[cur.k] = cur.v;
//         return acc;
//       }, {})

const filterKey = (keys: string[]) => (obj: Record<string, any>) => {
  const copy = { ...obj };
  keys.forEach(key => delete copy[key])
  return copy;
}

const userModel = new UserModel();

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
    const _payload = {
      ...payload,
      password: bcrypt.hashSync(payload.password, 10)
    }
    const user = userModel.add(_payload);
    return filterKey(['password'])(user);
  }

  /**
   * 根据邮箱查找用户
   * @param email 邮箱
   */
  public async findByEmail(
    email: string
  ) {
    const users = userModel.read();
    const user = users.find(item => item.email === email);
    if (!user) return null;
    return {
      ...user,
      comparePassword: (password: string) => bcrypt.compareSync(password, user.password),
    };
  }

  /**
   * 查找用户信息
   * @param id 用户ID
   */
  public async findById(id: number) {
    const user = userModel.read().find(item => item.id === id);
    if (!user) return user;
    return filterKey(['password'])(user);
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