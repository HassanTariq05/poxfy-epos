import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
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
import SalesSummary from '../../../components/pos/sales-history/sales-summary';

function SalesHistory() {
  const headers = [
    'Order Id',
    'Order Date',
    'Sale Type',
    'Customer',
    'Payment Type',
    'Payment Status',
    'Sale Total',
    'Discount',
    'Tax',
    'Remaining Balance',
    'Created By',
    'Modified By',
  ];

  const [register, setRegister] = useState('');
  const [totalSales, setTotalSales] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const {setIsLoadingTrue, setIsLoadingFalse, headerUrl, outletChange} =
    useAuthStore();

  const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    let formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    // Add suffix for the day (1st, 2nd, 3rd, etc.)
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][
      day % 10 < 4 && Math.floor(day / 10) !== 1 ? day % 10 : 0
    ];

    return formattedDate.replace(/\d{1,2}/, `${day}${suffix}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingTrue();
        const token = await AsyncStorage.getItem('userToken');
        let url = `${API_BASE_URL}sales/list`;

        console.log('URL:', url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            origin: headerUrl,
            referer: headerUrl,
          },
          params: {
            take: 10,
            page: 1,
          },
        });

        console.log('Response get Sales History:', response.data.data.data);
        const salesSum = response.data.data.data.reduce(
          (acc: number, item: any) => acc + (item.totalSale || 0),
          0,
        );
        setTotalSales(salesSum);

        const discountSum = response.data.data.data.reduce(
          (acc: number, item: any) => acc + (item.discountAmount || 0),
          0,
        );
        setTotalDiscount(discountSum);

        const taxSum = response.data.data.data.reduce(
          (acc: number, item: any) => acc + (item.tax || 0),
          0,
        );
        setTotalTax(taxSum);

        const formattedData = response.data.data.data.map((item: any) => ({
          'Order Id': item.orderId,
          'Order Date': item.orderDate ? formatOrderDate(item.orderDate) : '',
          'Sale Type': item.salesType?.toUpperCase(),
          Customer: item.customerName,
          'Payment Type': item.paymentType,
          'Payment Status': item.paymentStatus,
          'Sale Total': item.totalSale?.toFixed(2),
          Discount: item.discountAmount?.toFixed(2),
          Tax: item.tax?.toFixed(2),
          'Remaining Balance': item.remainingBalance?.toFixed(2),
          'Created By': item.createdBy?.fullName,
          'Modified By': item.updatedBy?.fullName,
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
      <TableCard heading="Sales History">
        <View style={[styles.searchContainer, styles.searchTextFocused]}>
          <MaterialCommunityIcons name="magnify" size={20} color="black" />
          <TextInput
            style={styles.searchText}
            value={register}
            placeholder="Find product by name, barcode"
            onChangeText={setRegister}
            keyboardType="default"
          />
        </View>

        <ScrollView
          persistentScrollbar={true}
          horizontal={false}
          style={{width: '100%'}}>
          <SalesSummary
            sales={totalSales}
            discount={totalDiscount}
            tax={totalTax}
          />

          <CustomDataTable
            flexes={[2, 4, 2, 3, 2, 2, 2, 2, 2, 3, 3, 3]}
            alignments={[
              'flex-start',
              'flex-start',
              'flex-start',
              'flex-start',
              'flex-start',
              'flex-start',
              'center',
              'center',
              'center',
              'center',
              'flex-start',
              'flex-start',
            ]}
            headers={headers}
            data={data}
            searchQuery={register}
            propWidth={1800}
            showRefund={true}
            onRefund={() => {}}
          />
        </ScrollView>
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

export default SalesHistory;
