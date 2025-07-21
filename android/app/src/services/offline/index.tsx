import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_QUEUE_KEY = 'offline_sales_queue';

export const queueOfflineSale = async (payload: any, headerUrl: string) => {
  const existingQueue = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
  const queue = existingQueue ? JSON.parse(existingQueue) : [];

  queue.push({payload, headerUrl});

  await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));

  console.log('Saved Sale to offline...', payload.offlineUUID);
};

export const getOfflineSales = async () => {
  const existingQueue = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
  const queue = existingQueue ? JSON.parse(existingQueue) : [];
  return queue;
};
