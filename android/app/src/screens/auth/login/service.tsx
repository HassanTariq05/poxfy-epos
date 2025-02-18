import {Api} from '../../../network/client';

export const submitLogin = async (data: any) => {
  return Api.post(`auth/login`, data);
};

export const forgetEmail = async (email: any) => {
  return Api.get(`auth/forgot-password/${email}`);
};

export const confirmPassword = async (data: any) => {
  return Api.post(`auth/reset-password`, data);
};
