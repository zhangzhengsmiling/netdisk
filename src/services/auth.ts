import { request } from '../utils/request';

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const login = async(params: LoginParams)  =>{
  return request<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    data: params,
  });
}

export const getUser = () => {
  return request<User>('/api/v1/auth/me');
}