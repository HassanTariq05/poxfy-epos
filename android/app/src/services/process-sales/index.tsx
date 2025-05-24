import AsyncStorage from '@react-native-async-storage/async-storage';
import {Api} from '../../network/client';
import {API_BASE_URL} from '../../constants';

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

export const postSaleOrder = async (payload: any, headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.post(`sales`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
      'access-key': 'q2DU1I89vQgw',
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

export const getDiscountsList = async (headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.get('list-of-values?type=discount_type', {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
      'access-key': 'q2DU1I89vQgw',
    },
  });
};

export const getTaxesList = async (headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.get('tax', {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
      'access-key': 'q2DU1I89vQgw',
    },
  });
};
