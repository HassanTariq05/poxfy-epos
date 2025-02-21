import {Api} from '../../network/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createCustomer = async (data: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.post(`supplier`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateCustomer = async (data: any, id: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.put(`supplier/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getAllCustomerApi = async () => {
  return Api.get(`supplier`);
};
export const deleteCustmer = async (id: any) => {
  const token = await AsyncStorage.getItem('userToken');
  return Api.delete(`supplier/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
