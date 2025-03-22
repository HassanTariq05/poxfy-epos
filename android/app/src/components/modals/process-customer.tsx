import React, {useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createSlug} from '../../services/product/brand';
import useAuthStore from '../../redux/feature/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../../constants';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';

interface SlideInModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectExistingCustomer: () => void;
  onSelectAddCustomer: () => void;
  setSelectedCustomerData: any;
}

const ProcessCustomerModal: React.FC<SlideInModalProps> = ({
  visible,
  onClose,
  onSelectExistingCustomer,
  onSelectAddCustomer,
  setSelectedCustomerData,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: 'Walk-In Customer',
      contact: '0',
    },
  });
  const slideAnim = useRef(new Animated.Value(500)).current;
  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0, // Slide in
        duration: 300,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 300);
    } else {
      Animated.timing(slideAnim, {
        toValue: 500, // Slide out
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const {setIsLoadingTrue, setIsLoadingFalse, headerUrl, isLoading} =
    useAuthStore();

  const onSubmit = async (data: any) => {
    const customerData = {
      id: null,
      Name: data.name,
      Phone: data.contact,
    };
    setSelectedCustomerData(customerData);
    onClose();
    reset();
  };

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const handleSelectExistingCustomer = () => {
    onClose();
    onSelectExistingCustomer();
  };

  const handleSelectAddCustomer = () => {
    onClose();
    onSelectAddCustomer();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingTrue();
        const token = await AsyncStorage.getItem('userToken');
        const url = `${API_BASE_URL}supplier/list?take=10&page=1`;
        console.log('Customer get url: ', url);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            origin: headerUrl,
            referer: headerUrl,
          },
        });

        console.log('Response Customer List:', response.data.data.data);

        setCustomers(response.data.data.data);

        setIsLoadingFalse();
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);
  const customerOptions = customers.map((customer: any) => ({
    label: customer.fullName + ' (' + customer.phone + ')',
    value: customer._id,
  }));

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[styles.modal, {transform: [{translateX: slideAnim}]}]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={30}
                  color="#ED6964"
                />
              </TouchableOpacity>
              <Text style={styles.title}>Customer</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Customer Name</Text>
              <Controller
                control={control}
                name="name"
                render={({field: {onChange, value}}) => (
                  <>
                    <TextInput
                      ref={nameInputRef}
                      style={styles.input}
                      placeholder="Enter Customer Name"
                      onChangeText={onChange}
                      value={value}
                    />
                  </>
                )}
              />

              <Text style={styles.label}>Contact Number</Text>
              <Controller
                control={control}
                name="contact"
                render={({field: {onChange, value}}) => (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Contact Number"
                      onChangeText={onChange}
                      value={value}
                    />
                  </>
                )}
              />
              <Text style={styles.label}>Or Select Existing Customer</Text>
              {/* <Dropdown
                style={styles.input}
                data={customerOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Customer"
                value={selectedCustomer}
                search
                searchPlaceholder="Search customer..."
                maxHeight={120}
                onChange={item => setSelectedCustomer(item.value)}
              /> */}
              <TouchableOpacity
                onPress={handleSelectExistingCustomer}
                style={[
                  styles.existingCustomerButton,
                  {marginBottom: 20},
                  isLoading && {opacity: 0.7},
                ]}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.existingCustomerButtonText}>
                    Select Existing Customer
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={[styles.button, isLoading && {opacity: 0.7}]}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Confirm</Text>
              )}
            </TouchableOpacity>

            <View style={styles.separator}>
              <Text style={styles.label}>Or</Text>
            </View>

            <TouchableOpacity
              onPress={handleSelectAddCustomer}
              style={[styles.button, isLoading && {opacity: 0.7}]}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Add Customer</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  notesText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgb(103, 223, 135)',
  },
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
    right: 0,
    width: '40%',
    maxHeight: '80%',
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: -2, height: 2},
    shadowRadius: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomColor: 'rgb(240,240,240)',
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
    color: 'gray',
  },
  required: {
    color: 'red',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  input: {
    height: 45,
    backgroundColor: 'none',
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 15,
    borderColor: 'rgb(240,240,240)',
    borderWidth: 1,
  },
  textarea: {
    height: 80,
    textAlignVertical: 'top',
    backgroundColor: 'none',
    borderWidth: 1,
    borderColor: 'rgb(240,240,240)',
  },
  button: {
    backgroundColor: '#ED6964',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  existingCustomerButton: {
    backgroundColor: 'white',
    borderColor: 'rgb(221,221,221)',
    borderWidth: 1,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  existingCustomerButtonText: {
    color: 'rgb(191,191,191)',
    fontSize: 16,
    fontWeight: '400',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  separator: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
});

export default ProcessCustomerModal;
