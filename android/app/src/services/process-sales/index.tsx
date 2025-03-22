import AsyncStorage from '@react-native-async-storage/async-storage';
import {Api} from '../../network/client';

export const getProductCategories = async (headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.get('product-type?active=true', {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
    },
  });
};

export const getProducts = async (url: string, headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
    },
  });
};

export const postSaleOrder = async (url: string, headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.post(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
    },
  });
};

export const getSales = async (salesId: string, headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.get('sales/' + salesId, {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
    },
  });
};
