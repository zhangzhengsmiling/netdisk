import 'egg';
import { FileSystem } from 'netdisk_base';

declare module 'egg' {
  interface Context {
    model: IModel;
    state: {
      user?: {
        _id: string;
        username: string;
      };
    };
  }

  interface EggAppConfig {
    jwt: {
      secret: string;
      expiresIn: string;
    };
    netdisk: {
      root: string;
      allowedExtensions: string[];
      maxFileSize: number;
    };
  }

  interface Application {
    mongoose: any;
    jwt: {
      sign(payload: any, secret: string, options?: any): string;
      verify(token: string, secret: string, options?: any): any;
    };
    middleware: {
      auth(): any;
    };
  }

  interface IModel {
    User: any;
  }
}