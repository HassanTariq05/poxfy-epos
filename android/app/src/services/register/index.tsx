import AsyncStorage from '@react-native-async-storage/async-storage';
import {Api} from '../../network/client';

export const getRegisterDetailsApi = async (id: any, headerUrl: any) => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    return Api.get(`cash-register/current?outletId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
      },
    });
  } catch (error) {
    console.error('Error fetching register details:', error);
    throw error;
  }
};
export const closeRegister = async (id, payload, registerID) => {
  return Api.put(`cash-register/${id}/close/${registerID}`, payload);
};

export const openRegister = async (payload: any, id: any, headerUrl: any) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('User token not found');
    }

    const url = `cash-register/${id}/open`;
    console.log('Final API URL:', url);
    console.log('Payload:', payload);

    return Api.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        origin: headerUrl,
        referer: headerUrl,
      },
    });
  } catch (error) {
    console.error('Error opening register:', error);
    throw error;
  }
};

export const cashInnOutApi = async (
  registerID: any,
  registerDetailsId: any,
  type: any,
  payload: any,
  headerUrl: any,
) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('User token not found');
    }

    const url = `cash-register/${registerID}/active-register/${registerDetailsId}/transaction/${type}`;
    console.log('Final API URL:', url);
    console.log('Payload:', payload);

    return Api.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        origin: headerUrl,
        referer: headerUrl,
      },
    });
  } catch (error) {
    console.error('Error in cashInnOutApi:', error);
    throw error;
  }
};
