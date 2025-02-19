import {Api} from '../../network/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const changeOutletStatus = async (id, data) => {
  return Api.put(`outlet/${id}`, data);
};
export const createOutlet = async data => {
  return Api.post(`outlet`, data);
};
export const updateOutlet = async (data, id) => {
  return Api.put(`outlet/${id}`, data);
};
export const getAllOutletApi = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await Api.get('outlet', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching outlets:', error);
    throw error;
  }
};
export const getOutletByIdApi = async id => {
  return Api.get(`outlet/${id}`);
};
export const deleteOutletApi = async id => {
  return Api.delete(`outlet/${id}`);
};
export const getStoreApi = async () => {
  return Api.get(`me/store`);
};
export const updateStore = async data => {
  return Api.put(`me/store`, data);
};

export const changeRegisterStatus = async (id, data) => {
  return Api.put(`cash-register/${id}`, data);
};
export const createRegister = async data => {
  return Api.post(`cash-register`, data);
};
export const updateRegister = async (data, id) => {
  return Api.put(`cash-register/${id}`, data);
};
export const getAllRegisterApi = async () => {
  return Api.get(`cash-register`);
};
export const deleteRegisterApi = async id => {
  return Api.delete(`cash-register/${id}`);
};
