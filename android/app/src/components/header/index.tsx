import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {getAllOutletApi} from '../../services/outlet';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../../redux/feature/store';
import {useFocusEffect} from '@react-navigation/native';

export default function Header() {
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>('null');

  /** Load stored outlet */
  const getStoredOutlet = async () => {
    try {
      const outletId = await AsyncStorage.getItem('selectedOutlet');
      if (outletId) setSelectedOutlet(outletId);
    } catch (error) {
      console.log('Error retrieving outlet:', error);
    }
  };

  const {setIsLoadingTrue, setIsLoadingFalse, headerUrl, toggleOutletChange} =
    useAuthStore();

  const getOutlet = async () => {
    try {
      setIsLoadingTrue();
      const {data: response} = await getAllOutletApi(headerUrl);

      if (response?.data?.length > 0) {
        const outletsData = response.data.map((outlet: any) => ({
          label: outlet.name,
          value: outlet._id,
        }));

        console.log('Stringified Outlets: ', JSON.stringify(outletsData));

        await AsyncStorage.setItem('outletsData', JSON.stringify(outletsData));

        setOutlets(outletsData);

        // Get the stored outlet from AsyncStorage
        const savedOutlet = await AsyncStorage.getItem('selectedOutlet');

        // Check if the saved outlet is still valid (exists in the new list)
        const isValidOutlet = outletsData.some(
          outlet => outlet.value === savedOutlet,
        );

        if (isValidOutlet) {
          // Restore previously selected outlet
          setSelectedOutlet(savedOutlet);
          if (savedOutlet) {
            await AsyncStorage.setItem('selectedOutlet', savedOutlet);
          }
          console.log('Restored selected outlet:', savedOutlet);
        } else {
          // Select the first outlet if no valid saved outlet exists
          const firstOutlet = outletsData[0].value;
          setSelectedOutlet(firstOutlet);
          await AsyncStorage.setItem('selectedOutlet', firstOutlet);
          console.log('Selected first outlet:', firstOutlet);
        }
      } else {
        setOutlets([]);
        setSelectedOutlet(null);
        await AsyncStorage.removeItem('selectedOutlet');
        console.log('No outlets found.');
      }
    } catch (err) {
      console.log('Error fetching outlets:', err);
    } finally {
      setIsLoadingFalse();
    }
  };

  const handleOutletChange = async (item: any) => {
    try {
      setSelectedOutlet(item.value);
      await AsyncStorage.setItem('selectedOutlet', item.value);
      toggleOutletChange();
      console.log('Selected outlet:', item.value);
    } catch (error) {
      console.log('Error storing outlet:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getStoredOutlet().then(getOutlet);
      return () => {};
    }, []),
  );

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(user => setUser(user))
      .catch(error => console.error('Failed to load user:', error));
  }, []);

  const {logout} = useAuthStore();

  const handleSignOut = async () => {
    await removeToken();
    await removeApiBaseUrl();
    await removeUser();
    logout();
  };

  const removeToken = async () => {
    return AsyncStorage.removeItem('userToken');
  };

  const removeApiBaseUrl = async () => {
    return AsyncStorage.removeItem('API_BASE_URL');
  };

  const removeUser = async () => {
    return AsyncStorage.removeItem('user');
  };

  return (
    <View style={styles.header}>
      <View style={styles.viewStyle}>
        <Dropdown
          style={styles.storeButton}
          data={outlets}
          labelField="label"
          valueField="value"
          placeholder="Select Store"
          placeholderStyle={{color: 'gray'}}
          containerStyle={{borderRadius: 10}}
          selectedTextStyle={{fontSize: 14}}
          value={selectedOutlet}
          onChange={handleOutletChange}
          itemTextStyle={{fontSize: 13}}
          selectedTextProps={{numberOfLines: 1}}
        />
        <View
          style={[
            styles.searchContainer,
            isSearchFocused && styles.searchTextFocused,
          ]}>
          <MaterialCommunityIcons name="magnify" size={20} color="black" />
          <TextInput
            style={[styles.searchText]}
            value={email}
            placeholder="Search..."
            onChangeText={setEmail}
            keyboardType="email-address"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.adminButton}
        onPress={() => setAdminDropdownOpen(!adminDropdownOpen)}>
        <Text style={styles.adminText}>{user}</Text>
        <Feather name="chevron-down" size={16} color="black" />
        <MaterialCommunityIcons
          name="account-circle"
          size={24}
          color="gray"
          style={styles.userIcon}
        />
      </TouchableOpacity>

      {adminDropdownOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            onPress={() => setAdminDropdownOpen(!adminDropdownOpen)}
            style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#666" />
          </TouchableOpacity>

          <MaterialCommunityIcons
            name="account-circle"
            size={80}
            color="#000"
          />

          {/* Centering Wrapper */}
          <View style={styles.contentWrapper}>
            <View style={styles.userInfo}>
              <Text style={styles.username}>
                Hi, <Text style={styles.bold}>{user}</Text>
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSignOut}
              style={styles.signOutButton}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.signOutText}>Sign Out</Text>
                {/* <MaterialCommunityIcons name="logout" size={20} color="#fff" /> */}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingRight: 10,
    borderRadius: 20,
    marginHorizontal: 10,
    width: '100%',
    height: 60,
  },
  viewStyle: {
    flexDirection: 'row',
    gap: 10,
  },
  storeButton: {
    flexDirection: 'row',
    maxWidth: 180,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  storeText: {fontSize: 14, marginRight: 5},

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 20,
    width: 220,
  },
  searchText: {fontSize: 14, marginLeft: 5, color: '#000'},
  searchTextFocused: {
    borderWidth: 1,
    borderColor: 'rgb(32, 97, 197)',
    paddingHorizontal: 10,
  },

  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adminText: {fontSize: 14, marginRight: 5},
  userIcon: {marginLeft: 6},

  dropdown: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '30%',
    zIndex: 10,
    elevation: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  contentWrapper: {
    alignItems: 'center', // Center the text and button inside
    justifyContent: 'center',
    alignSelf: 'center', // Makes sure the wrapper adjusts width
  },
  userInfo: {
    flexDirection: 'row', // Aligns items horizontally
    alignItems: 'center', // Centers items vertically
    justifyContent: 'center', // Centers the row horizontally
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: '#E85050',
    width: 'auto', // Ensures it wraps content
    minWidth: 150, // Optional: keeps button at a reasonable size
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center', // Centers items vertically
    justifyContent: 'center', // Centers items horizontally
    alignSelf: 'center',
    marginTop: 15,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center', // Ensures text is centered inside Text component
    fontWeight: 'bold', // Makes it more noticeable
    flex: 1, // Ensures it takes up space and centers properly
  },
});
