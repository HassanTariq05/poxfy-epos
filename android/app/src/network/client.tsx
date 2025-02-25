import axios from 'axios';
import {API_BASE_URL} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an axios instance with a default base URL
export const Api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const updateBaseUrl = async () => {
  const baseURL = await AsyncStorage.getItem('API_BASE_URL');
  if (baseURL) {
    Api.defaults.baseURL = baseURL;
    console.log(`Updated Base URL: ${baseURL}`);
  } else {
    console.log(`Base URL remains: ${Api.defaults.baseURL}`);
  }
};

export const updateSocketUrl = async () => {
  const socketUrl = await AsyncStorage.getItem('SOCKET_URL');
  if (socketUrl) {
    return socketUrl;
  } else {
    console.log(`no socket url found`);
  }
};

export const updateBaseUrlExplicitly = (baseURL: any) => {
  if (baseURL) {
    Api.defaults.baseURL = baseURL;
    console.log(`Updated Base URL: ${baseURL}`);
  } else {
    console.log(`Base URL remains: ${Api.defaults.baseURL}`);
  }
};

Api.interceptors.request.use(config => {
  console.log(`API Request to: ${config.baseURL}${config.url}`);
  console.log(
    `API Request to: ${config.baseURL}${config.url}${config.headers}`,
  );
  return config;
});
