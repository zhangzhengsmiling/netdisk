import { Application } from 'egg';
import * as bcrypt from 'bcryptjs';

// interface IUser {
//   username: string;
//   email: string;
//   password: string;
//   createdAt: Date;
//   comparePassword(candidatePassword: string): Promise<boolean>;
// }

// interface IUserDocument extends IUser {
//   isModified(path: string): boolean;
// }

export default (app: Application) => {
  // const mongoose = app.mongoose;

  // const UserSchema = new mongoose.Schema({
  //   username: {
  //     type: String,
  //     required: [true, '请输入用户名'],
  //     unique: true,
  //     trim: true,
  //     minlength: [3, '用户名至少需要3个字符'],
  //     maxlength: [20, '用户名不能超过20个字符']
  //   },
  //   email: {
  //     type: String,
  //     required: [true, '请输入邮箱'],
  //     unique: true,
  //     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
  //   },
  //   password: {
  //     type: String,
  //     required: [true, '请输入密码'],
  //     minlength: [6, '密码至少需要6个字符'],
  //     select: false
  //   },
  //   createdAt: {
  //     type: Date,
  //     default: Date.now
  //   }
  // });

  // // 加密密码
  // UserSchema.pre('save', async function(this: IUserDocument, next) {
  //   if (!this.isModified('password')) {
  //     return next();
  //   }
  //   const salt = await bcrypt.genSalt(10);
  //   this.password = await bcrypt.hash(this.password, salt);
  //   next();
  // });

  // // 验证密码
  // UserSchema.methods.comparePassword = async function(this: IUserDocument, candidatePassword: string): Promise<boolean> {
  //   return await bcrypt.compare(candidatePassword, this.password);
  // };

  // return mongoose.model('User', UserSchema);
  return {};
};