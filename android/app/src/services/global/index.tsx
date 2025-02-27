import {Api} from '../../network/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAll = async (endPoint: any) => {
  return Api.get(endPoint);
};

export const getSlugListOfValuesByKey = async (key: any, headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.get(`product-slug/${key}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
    },
  });
};

export const getAllListOfValueByKey = async (key: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.get(`list-of-values?type=${key}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllLanguages = async () => {
  return Api.get(`list-of-values/languages`);
};

export const updateLov = async (id: any, payload: any) => {
  return Api.put(`list-of-values/cms/${id}`, payload);
};
