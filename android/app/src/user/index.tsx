import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get user token
export const getUserToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const getSelectedOutlet = async () => {
  try {
    const selectedOutlet = await AsyncStorage.getItem('selectedOutlet');
    return selectedOutlet;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};
