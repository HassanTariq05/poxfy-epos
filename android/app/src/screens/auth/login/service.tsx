import {Api} from '../../../network/client';

export const submitLogin = async (data: any, baseURL: any) => {
  console.log('Data:', data);
  console.log('Base URL:', baseURL);
  return Api.post(`auth/login`, data, {
    headers: {
      origin: baseURL,
      referer: baseURL,
    },
  });
};

export const forgetEmail = async (email: any) => {
  return Api.get(`auth/forgot-password/${email}`);
};

export const confirmPassword = async (data: any) => {
  return Api.post(`auth/reset-password`, data);
};
