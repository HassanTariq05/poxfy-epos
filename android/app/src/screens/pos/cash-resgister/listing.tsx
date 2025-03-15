import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, TextInput, View} from 'react-native';
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
import useAuthStore from '../../../redux/feature/store';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

function Listing() {
  const headers = [
    'Name',
    'Receipt No',
    'Receipt Prefix',
    'Receipt Suffix',
    'Outlet',
    'Created By',
  ];

  const [register, setRegister] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const {
    setIsLoadingTrue,
    setIsLoadingFalse,
    headerUrl,
    outletChange,
    redirectToProcessSales,
  } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingTrue();
        const token = await AsyncStorage.getItem('userToken');
        const outletId = await AsyncStorage.getItem('selectedOutlet');
        let url = `${API_BASE_URL}cash-register/list?take=10&page=1&outletId=${outletId}`;
        console.log('URL:', url);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            origin: headerUrl,
            referer: headerUrl,
          },
        });

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
        setIsLoadingFalse();
      } catch (err) {
        console.error('Error fetching data:', err);
        setIsLoadingFalse();
      }
    };

    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchCurrentRegister = async () => {
        try {
          setIsLoadingTrue();
          const token = await AsyncStorage.getItem('userToken');
          const outletId = await AsyncStorage.getItem('selectedOutlet');
          let url = `${API_BASE_URL}cash-register/current?outletId=${outletId}`;
          console.log('URL:', url);
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              origin: headerUrl,
              referer: headerUrl,
            },
          });

          console.log('Response Current Register:', response.data);

          if (
            !('success' in response.data?.data) ||
            response.data?.data?.success
          ) {
            navigation.navigate('Listing');
          }

          setIsLoadingFalse();
        } catch (err) {
          console.error('Error fetching data:', err);
          setIsLoadingFalse();
        }
      };

      fetchCurrentRegister();

      return () => {};
    }, [outletChange]),
  );

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
      setIsLoadingTrue();
      response = await openRegister(payload, selectedRow, headerUrl);
      console.log('Response Open resgister:', response.data.data);
      if (response?.data.meta.success) {
        if (redirectToProcessSales) {
          navigation.navigate('POS-Process-Sales');
          return;
        }
        navigation.navigate('Listing');
        setModalVisible(false);
        setIsLoadingFalse();
      }
    } catch (err) {
      console.log(err);
      setIsLoadingFalse();
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
            value={register}
            placeholder="Find..."
            onChangeText={setRegister}
            keyboardType="email-address"
          />
        </View>

        <CustomDataTable
          flexes={[1, 1, 1, 1, 2, 1]}
          alignments={[
            'flex-start',
            'center',
            'flex-start',
            'flex-start',
            'flex-start',
            'flex-start',
          ]}
          headers={headers}
          data={data}
          searchQuery={register}
          showOpenRegister={true}
          onOpenRegister={handleOpenRegisterClick}
        />
      </TableCard>

      {/* Slide-in Modal */}
      <SlideInModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
