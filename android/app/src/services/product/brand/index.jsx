import {Api} from '../../../network/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const changeSlugStatus = async (id, slug, data) => {
  return Api.put(`product-slug/${slug}/${id}`, data);
};
export const createSlug = async (slug, data, headerUrl) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.post(`product-slug/${slug}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
    },
  });
};
export const updateSlug = async (slug, data, id, headerUrl) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.put(`product-slug/${slug}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
    },
  });
};
export const getAllSlugApi = async slug => {
  return Api.get(`product-slug/${slug}`);
};
export const deleteslug = async (slug, id, headerUrl) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.delete(`product-slug/${slug}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
    },
  });
};
