import Database from 'app/database';

interface IUser {
  username: string;
  email: string;
  password: string;
  id?: number;
  gmt_created?: number;
  gmt_modified?: number;
}

class UserModel extends Database<IUser> {
  constructor() {
    super('user');
  }
}

export default UserModel