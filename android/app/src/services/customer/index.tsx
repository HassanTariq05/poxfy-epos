import {Api} from '../../network/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isDeviceOnline} from '../dashboard';

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
export const getLoyaltyBalance = async (id: any, headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(`supplier/${id}/loyality-balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
      },
    });
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('get_loyalty_balance_' + id, dataString);
    return data;
  } else {
    const dataString =
      (await AsyncStorage.getItem('get_loyalty_balance_' + id)) ?? '{}';
    return JSON.parse(dataString);
  }
};
export const getLoyaltyReport = async (
  customerId: any,
  query: string,
  headerUrl: any,
) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(
      `report/customer-loyality-report?customerIds[]=${customerId}&${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          origin: headerUrl,
          referer: headerUrl,
        },
      },
    );
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('loyalty_report_' + customerId, dataString);
    return data;
  } else {
    const dataString =
      (await AsyncStorage.getItem('loyalty_report_' + customerId)) ?? '{}';
    return JSON.parse(dataString);
  }
};
