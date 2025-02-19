import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import CustomDataTable from '../../../components/data-table';
import TableCard from '../../../components/table-card';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SlideInModal from '../../../components/modals/open-register';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {getRegisterDetailsApi, openRegister} from '../../../services/register';
import {getSelectedOutlet} from '../../../user';
import axios from 'axios';
import {API_BASE_URL} from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Listing() {
  const headers = [
    'Name',
    'Receipt No',
    'Receipt Prefix',
    'Receipt Suffix',
    'Outlet',
    'Created By',
  ];

  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [outletId, setOutletId] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const navigation = useNavigation<DrawerNavigationProp<any>>();

  useEffect(() => {
    const fetchOutletId = async () => {
      const id = await getSelectedOutlet();
      setOutletId(id);
    };

    fetchOutletId();
  }, []);

  useEffect(() => {
    if (!outletId) return;

    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(
          `${API_BASE_URL}/cash-register/list?take=10&page=1&outletId=${outletId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('Response:', response.data.data.data);

        const formattedData = response.data.data.data.map((item: any) => ({
          id: item._id,
          Name: item.name,
          'Receipt No': item.receiptNo,
          'Receipt Prefix': item.receiptPrefix,
          'Receipt Suffix': item.receiptSuffix,
          Outlet: item.outlet?.name,
          'Created By': item.createdBy?.fullName || 'N/A',
        }));

        console.log('Formatted data:', formattedData);

        setData(formattedData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [outletId]);

  const handleOpenRegister = async (data: {
    openingBalance: string;
    notes: string;
  }) => {
    let response;
    try {
      const payload = {
        ...data,
        openingBalance: Number(data.openingBalance),
        closingNotes: data.notes,
      };
      console.log('Payload:', payload);
      if (outletId) {
        response = await openRegister(payload, selectedRow);
        console.log('Response Open resgister:', response.data.data);
      }
      if (response?.data.meta.success) {
        saveRegister(response.data.data);
        navigation.navigate('Listing');
        setModalVisible(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const saveRegister = async (register: any) => {
    try {
      await AsyncStorage.setItem('registerData', register);
    } catch (error) {
      console.error('Error saving register data:', error);
    }
  };

  const handleOpenRegisterClick = (row: any) => {
    setSelectedRow(row.id);
    setModalVisible(true);
  };

  return (
    <View>
      <TableCard heading="Register">
        <View style={[styles.searchContainer, styles.searchTextFocused]}>
          <MaterialCommunityIcons name="magnify" size={20} color="black" />
          <TextInput
            style={styles.searchText}
            value={email}
            placeholder="Find..."
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {outletId && (
          <CustomDataTable
            headers={headers}
            data={data}
            showOpenRegister={true}
            // onOpenRegister={() => setModalVisible(true)}
            onOpenRegister={handleOpenRegisterClick}
          />
        )}
      </TableCard>

      {/* Slide-in Modal */}
      <SlideInModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        // onOpenPress={() => {navigation.navigate('Listing')}}
        onOpenPress={handleOpenRegister}
      />
    </View>
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

export default Listing;
