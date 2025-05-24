import {Api} from '../../network/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createCustomer = async (data: any, headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.post(`supplier`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
    },
  });
};
export const updateCustomer = async (data: any, id: any, headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.put(`supplier/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
    },
  });
};
export const getAllCustomerApi = async () => {
  return Api.get(`supplier`);
};
export const deleteCustmer = async (id: any, headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.delete(`supplier/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
    },
  });
};
export const getSales = async (outletId: any, headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.get(
    `dashboard/sales?outletIds=${outletId}&outletIds=${outletId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
      },
    },
  );
};
export const getProducts = async (outletId: any, headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.get(
    `dashboard/top-product?outletIds=${outletId}&outletIds=${outletId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
      },
    },
  );
};
export const getOutlets = async (outletId: any, headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.get(`dashboard/top-outlets?outletIds=${outletId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      origin: headerUrl,
      referer: headerUrl,
    },
  });
};
export const getCustomerInsights = async (outletId: any, headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.get(
    `dashboard/customer-insights
?outletIds=${outletId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
      },
    },
  );
};
export const getInventoryInsights = async (outletId: any, headerUrl: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.get(
    `dashboard/inventory-insights
?outletIds=${outletId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
      },
    },
  );
};
