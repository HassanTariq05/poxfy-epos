import {APP_VERSION} from '../../../constants';
import {Api} from '../../../network/client';

export const submitLogin = async (
  data: any,
  baseURL: any,
  appPlatform: any,
) => {
  console.log('Data:', data);
  console.log('Base URL:', baseURL);
  return Api.post(`auth/login`, data, {
    headers: {
      origin: baseURL,
      referer: baseURL,
      'app-platform': appPlatform,
      'app-version': APP_VERSION,
    },
  });
};

export const forgetEmail = async (email: any) => {
  return Api.get(`auth/forgot-password/${email}`);
};

export const confirmPassword = async (data: any) => {
  return Api.post(`auth/reset-password`, data);
};
