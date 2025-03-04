import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, ToastAndroid, View} from 'react-native';
import CustomDataTable from '../../../components/data-table';
import TableCard from '../../../components/table-card';
import {dummyCustomerData} from '../../../data/dummyData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddCustomerModal from '../../../components/modals/add-customer';
import EditCustomerModal from '../../../components/modals/edit-customer';
import {
  getAllListOfValueByKey,
  getSlugListOfValuesByKey,
} from '../../../services/global';
import axios from 'axios';
import {API_BASE_URL} from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomPopConfirm from '../../../components/pop-confirm';
import {deleteCustmer, updateCustomer} from '../../../services/customer';
import useAuthStore from '../../../redux/feature/store';

function Customer() {
  const headers = ['Code', 'Name', 'Phone', 'Email', 'Country'];

  const [customer, setCustomer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setEditModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    [key: string]: string | number;
  } | null>(null);
  const [gender, setGender] = useState([]);
  const [tier, setTier] = useState([]);
  const [tag, setTag] = useState([]);
  const [data, setData] = useState<any>([]);
  const [refetch, setRefetch] = useState(false);
  const {setIsLoadingTrue, setIsLoadingFalse, headerUrl} = useAuthStore();

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

        const formattedData = response.data.data.data.map((item: any) => ({
          ...item,
          id: item._id,
          Code: item.code,
          Name: item.fullName,
          Phone: item.phone,
          Email: item.email,
          Country: item.country,
        }));

        console.log('Formatted data:', formattedData);

        setData((prev: any) => {
          console.log('Previous Data:', prev);
          console.log('New Data:', formattedData);
          return [...formattedData];
        });
        setIsLoadingFalse();
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [refetch]);

  // const getListOfValues = async () => {
  //   try {
  //     const response = await getAllListOfValueByKey('gender');
  //     console.log(response);
  //     setGender(response.data.data.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // useEffect(() => {
  //   getListOfValues();
  // }, []);

  const handleHeadingAction = () => {
    setModalVisible(true);
  };

  const handleEdit = (row: {[key: string]: string | number}) => {
    console.log(row);
    setSelectedCustomer(row);
    setEditModalVisible(true);
  };

  const [popConfirmVisible, setPopConfirmVisible] = useState(false);
  const [popSwitchConfirmVisible, setPopSwitchConfirmVisible] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [customerToSwitch, setCustomerToSwitch] = useState(null);

  const handleDelete = async () => {
    if (customerToDelete) {
      setIsLoadingTrue();
      console.log('Deleting customer:', customerToDelete);
      await deleteCustomer(customerToDelete, headerUrl);

      setData((prevData: any) =>
        prevData.filter((cust: any) => cust._id !== customerToDelete._id),
      );

      setPopConfirmVisible(false);
      setIsLoadingFalse();
      ToastAndroid.showWithGravityAndOffset(
        'Record deleted successfully',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  };

  const deleteCustomer = async (customer: any, headerUrl: any) => {
    const response = await deleteCustmer(customer?._id, headerUrl);
    console.log('Delete Customer Response:', response);
  };

  const confirmDelete = (customer: any) => {
    setCustomerToDelete(customer);
    setPopConfirmVisible(true);
  };

  const handleSwitch = async () => {
    if (customerToSwitch) {
      setIsLoadingTrue();
      console.log('Switching customer:', customerToSwitch);
      await switchCustomer(customerToSwitch);
      setIsLoadingFalse();
    }
  };

  const switchCustomer = async (customer: any) => {
    try {
      const payload = {
        ...customer,
        isActive: !customer.isActive,
      };
      const response = await updateCustomer(payload, customer?._id, headerUrl);
      console.log('Switch Customer Response:', response);
      setRefetch((prev: any) => !prev);
      setPopSwitchConfirmVisible(false);
      ToastAndroid.showWithGravityAndOffset(
        'Updated successfully',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } catch (error) {
      return null;
    }
  };

  const confirmSwitch = (customer: any) => {
    setCustomerToSwitch(customer);
    setPopSwitchConfirmVisible(true);
  };

  const handleOnCloseAddModal = () => {
    setModalVisible(false);
  };

  const handleOnSwitchPopCancel = () => {
    setPopSwitchConfirmVisible(false);
    setRefetch((prev: any) => !prev);
  };

  return (
    <>
      <View>
        <TableCard
          heading="Customer"
          button={'Add Customer'}
          onAction={handleHeadingAction}>
          <View style={[styles.searchContainer, styles.searchTextFocused]}>
            <MaterialCommunityIcons name="magnify" size={20} color="black" />
            <TextInput
              style={styles.searchText}
              value={customer}
              placeholder="Find Customer"
              onChangeText={setCustomer}
              keyboardType="default"
            />
          </View>
          <CustomDataTable
            flexes={[1, 2, 2, 3, 2]}
            alignments={[
              'center',
              'flex-start',
              'flex-start',
              'flex-start',
              'flex-start',
              'center',
              'center',
            ]}
            headers={headers}
            data={data}
            searchQuery={customer}
            showEdit={true}
            onEdit={handleEdit}
            showDelete={true}
            onDelete={confirmDelete}
            showSwitch={true}
            onToggleSwitch={confirmSwitch}
          />
          <CustomPopConfirm
            title="Confirm Deletion"
            description="Are you sure you want to delete this customer?"
            onConfirm={handleDelete}
            onCancel={() => setPopConfirmVisible(false)}
            okText="Delete"
            cancelText="Cancel"
            visible={popConfirmVisible}
            setVisible={setPopConfirmVisible}
          />
          <CustomPopConfirm
            title="Confirm"
            description="Are you sure?"
            onConfirm={handleSwitch}
            onCancel={handleOnSwitchPopCancel}
            okText="Update"
            cancelText="Cancel"
            visible={popSwitchConfirmVisible}
            setVisible={setPopSwitchConfirmVisible}
          />
        </TableCard>

        <AddCustomerModal
          visible={modalVisible}
          gender={gender}
          setRefetch={setRefetch}
          onClose={handleOnCloseAddModal}
        />

        <EditCustomerModal
          setRefetch={setRefetch}
          visible={modalEditVisible}
          onClose={() => setEditModalVisible(false)}
          customer={selectedCustomer}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 20,
    width: '100%',
    marginBottom: 20,
    marginTop: 10,
  },
  searchText: {
    fontSize: 14,
    marginLeft: 5,
    color: '#000',
  },
  searchTextFocused: {
    borderWidth: 1,
    borderColor: 'rgb(230, 231, 235)',
    paddingHorizontal: 10,
  },
});

export default Customer;
