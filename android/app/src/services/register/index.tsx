import AsyncStorage from '@react-native-async-storage/async-storage';
import {Api} from '../../network/client';
import {isDeviceOnline} from '../dashboard';

export const getRegisterDetailsApi = async (id: any, headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(`cash-register/current?outletId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
      },
    });
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('cash_register_detail_' + id, dataString);
    return data;
  } else {
    const dataString =
      (await AsyncStorage.getItem('cash_register_detail_' + id)) ?? '{}';
    return JSON.parse(dataString);
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
