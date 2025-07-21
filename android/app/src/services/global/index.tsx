import {Api} from '../../network/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isDeviceOnline} from '../dashboard';

export const getAll = async (endPoint: any) => {
  return Api.get(endPoint);
};

export const getSlugListOfValuesByKey = async (key: any, headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(`product-slug/${key}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
      },
    });
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem(key, dataString);
    return data;
  } else {
    const dataString = (await AsyncStorage.getItem(key)) ?? '{}';
    return JSON.parse(dataString);
  }
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
