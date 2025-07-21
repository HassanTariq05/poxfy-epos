import {Api} from '../../network/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export async function isDeviceOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return (state.isConnected ?? false) && state.isInternetReachable !== false;
}

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
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(
      `dashboard/sales?outletIds=${outletId}&outletIds=${outletId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          origin: headerUrl,
          referer: headerUrl,
        },
      },
    );
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('get_sales', dataString);
    return data;
  } else {
    const dataString = (await AsyncStorage.getItem('get_sales')) ?? '{}';
    return JSON.parse(dataString);
  }
};
export const getProducts = async (outletId: any, headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(
      `dashboard/top-product?outletIds=${outletId}&outletIds=${outletId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          origin: headerUrl,
          referer: headerUrl,
        },
      },
    );
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('get_products', dataString);
    return data;
  } else {
    const dataString = (await AsyncStorage.getItem('get_products')) ?? '{}';
    return JSON.parse(dataString);
  }
};
export const getOutlets = async (outletId: any, headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(`dashboard/top-outlets?outletIds=${outletId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
      },
    });
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('get_outlets', dataString);
    return data;
  } else {
    const dataString = (await AsyncStorage.getItem('get_outlets')) ?? '{}';
    return JSON.parse(dataString);
  }
};
export const getCustomerInsights = async (outletId: any, headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(
      `dashboard/customer-insights?outletIds=${outletId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          origin: headerUrl,
          referer: headerUrl,
        },
      },
    );
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('get_customer_insights', dataString);
    return data;
  } else {
    const dataString =
      (await AsyncStorage.getItem('get_customer_insights')) ?? '{}';
    return JSON.parse(dataString);
  }
};
export const getInventoryInsights = async (outletId: any, headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(
      `dashboard/inventory-insights?outletIds=${outletId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          origin: headerUrl,
          referer: headerUrl,
        },
      },
    );
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('get_inventory_insights', dataString);
    return data;
  } else {
    const dataString =
      (await AsyncStorage.getItem('get_inventory_insights')) ?? '{}';
    return JSON.parse(dataString);
  }
};
