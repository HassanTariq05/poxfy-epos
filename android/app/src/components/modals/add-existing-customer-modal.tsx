import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../../constants';
import useAuthStore from '../../redux/feature/store';

interface Customer {
  id: string;
  Code: string;
  Name: string;
  Phone: string;
  Email: string;
  Country: string;
}

interface AddCustomerModalProps {
  onClose: () => void;
  visible: boolean;
  onSelectCustomer: (customer: Customer) => void;
}

const AddExistingCustomerModal: React.FC<AddCustomerModalProps> = ({
  onClose,
  visible,
  onSelectCustomer,
}) => {
  const slideAnim = useRef(new Animated.Value(500)).current;
  const searchInputRef = useRef<TextInput>(null);
  const {setIsLoadingTrue, setIsLoadingFalse, headerUrl, isLoading} =
    useAuthStore();

  const [data, setData] = useState<Customer[]>([]);
  const [filteredData, setFilteredData] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingTrue();
        const token = await AsyncStorage.getItem('userToken');
        const url = `${API_BASE_URL}supplier/list?take=10&page=1`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            origin: headerUrl,
            referer: headerUrl,
          },
        });

        const formattedData = response.data.data.data.map((item: any) => ({
          id: item._id,
          Code: item.code,
          Name: item.fullName,
          Phone: item.phone,
          Email: item.email,
          Country: item.country,
        }));

        setData(formattedData);
        setFilteredData(formattedData);
        setIsLoadingFalse();
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    if (visible) fetchData();
  }, [visible]);

  // Search function
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = data.filter(customer =>
        customer.Name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <Animated.View
          style={[styles.modal, {transform: [{translateX: slideAnim}]}]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={30}
                color="#ED6964"
              />
            </TouchableOpacity>
            <Text style={styles.title}>Select Existing Customer</Text>
          </View>

          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search customer..."
            value={searchQuery}
            onChangeText={handleSearch}
          />

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#ED6964"
              style={styles.loader}
            />
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.customerItem}
                  onPress={() => {
                    onSelectCustomer(item);
                    onClose();
                  }}>
                  <View>
                    <Text style={styles.customerName}>{item.Name}</Text>
                    <Text style={styles.customerDetails}>
                      {item.Phone} | {item.Email}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#333"
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backdrop: {
    flex: 1,
    width: '100%',
  },
  modal: {
    position: 'absolute',
    top: '5%',
    right: 0,
    width: '60%',
    height: '80%',
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: -2, height: 2},
    shadowRadius: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: 'rgb(202,202,202)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  loader: {
    marginTop: 20,
  },
  customerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default AddExistingCustomerModal;
