import AsyncStorage from '@react-native-async-storage/async-storage';
import {Api} from '../../network/client';
import {API_BASE_URL} from '../../constants';
import {isDeviceOnline} from '../dashboard';
import {queueOfflineSale} from '../offline';

export const getProductCategories = async (headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get('product-type?active=true', {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
      },
    });
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('get_pos_categories', dataString);
    return data;
  } else {
    const dataString =
      (await AsyncStorage.getItem('get_pos_categories')) ?? '{}';
    return JSON.parse(dataString);
  }
};

export const getProducts = async (url: string, headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
      },
    });
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('get_pos_products', dataString);
    return data;
  } else {
    const dataString = (await AsyncStorage.getItem('get_pos_products')) ?? '{}';
    return JSON.parse(dataString);
  }
};

export const postSaleOrder = async (payload: any, headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (!isOnline) {
    await queueOfflineSale(payload, headerUrl);
    return {offlineQueued: true};
  }

  console.log('Processing Sale online...', payload.offlineUUID);
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
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get('sales/' + salesId, {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
      },
    });
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('get_pos_sales_' + salesId, dataString);
    return data;
  } else {
    const dataString =
      (await AsyncStorage.getItem('get_pos_sales_' + salesId)) ?? '{}';
    return JSON.parse(dataString);
  }
};

export const getDiscountsList = async (headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get('list-of-values?type=discount_type', {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
        'access-key': 'q2DU1I89vQgw',
      },
    });
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('get_pos_discounts', dataString);
    return data;
  } else {
    const dataString =
      (await AsyncStorage.getItem('get_pos_discounts')) ?? '{}';
    return JSON.parse(dataString);
  }
};

export const getTaxesList = async (headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get('tax', {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
        'access-key': 'q2DU1I89vQgw',
      },
    });
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('get_pos_taxes', dataString);
    return data;
  } else {
    const dataString = (await AsyncStorage.getItem('get_pos_taxes')) ?? '{}';
    return JSON.parse(dataString);
  }
};

export const getCurrentRegister = async (outletId: any, headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(`cash-register/current?outletId=${outletId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
        'access-key': 'q2DU1I89vQgw',
      },
    });
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('current_register_' + outletId, dataString);
    return data;
  } else {
    const dataString =
      (await AsyncStorage.getItem('current_register_' + outletId)) ?? '{}';
    return JSON.parse(dataString);
  }
};

export const getSaleHistory = async (
  skip: any,
  limit: any,
  queryParams: string,
  headerUrl: any,
) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(
      `sales/list?skip=${skip * limit}&limit=${limit}&${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          origin: headerUrl,
          referer: headerUrl,
          'access-key': 'q2DU1I89vQgw',
        },
      },
    );
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('sale_history_' + skip, dataString);
    return data;
  } else {
    const dataString =
      (await AsyncStorage.getItem('sale_history_' + skip)) ?? '{}';
    return JSON.parse(dataString);
  }
};

export const getCashRegisters = async (outletId: any, headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(
      `cash-register/list?take=10&page=1&outletId=${outletId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          origin: headerUrl,
          referer: headerUrl,
          'access-key': 'q2DU1I89vQgw',
        },
      },
    );
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('cash_registers', dataString);
    return data;
  } else {
    const dataString = (await AsyncStorage.getItem('cash_registers')) ?? '{}';
    return JSON.parse(dataString);
  }
};

export const getMyInventory = async (queryParams: string, headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(`inventory-ledger?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
        'access-key': 'q2DU1I89vQgw',
      },
    });
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('my_inventory', dataString);
    return data;
  } else {
    const dataString = (await AsyncStorage.getItem('my_inventory')) ?? '{}';
    return JSON.parse(dataString);
  }
};

export const getCustomerList = async (headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(`supplier/list?take=10&page=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
        'access-key': 'q2DU1I89vQgw',
      },
    });
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('customers', dataString);
    return data;
  } else {
    const dataString = (await AsyncStorage.getItem('customers')) ?? '{}';
    return JSON.parse(dataString);
  }
};

export const getSaleDetials = async (saleId: string, headerUrl: any) => {
  const isOnline = await isDeviceOnline();
  if (isOnline) {
    const token = await AsyncStorage.getItem('userToken');
    const data = await Api.get(`sales/${saleId}/public?type=undefined`, {
      headers: {
        Authorization: `Bearer ${token}`,
        origin: headerUrl,
        referer: headerUrl,
        'access-key': 'q2DU1I89vQgw',
      },
    });
    const dataString = await JSON.stringify(data);
    await AsyncStorage.setItem('sale_detail_' + saleId, dataString);
    return data;
  } else {
    const dataString =
      (await AsyncStorage.getItem('sale_detail_' + saleId)) ?? '{}';
    return JSON.parse(dataString);
  }
};
