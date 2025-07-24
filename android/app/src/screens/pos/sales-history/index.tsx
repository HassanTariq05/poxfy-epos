import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
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
import {API_BASE_URL, paymentStatuses, paymentType} from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../../../redux/feature/store';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import SalesSummary from '../../../components/pos/sales-history/sales-summary';
import {Text} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import {Dropdown} from 'react-native-element-dropdown';
import DualDatePicker from '../../../components/dual-date-picker';
import {getSaleDetials, getSaleHistory} from '../../../services/process-sales';
import {getOfflineSales} from '../../../services/offline';
import moment from 'moment';
import NativePrintSdk from '../../../../../../specs/NativePrintSdk';
import {getOutletByIdApi} from '../../../services/outlet';

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

  const [searchValue, setSearchValue] = useState('');
  const [totalSales, setTotalSales] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [rawData, setRawData] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(
    null,
  );
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<
    string | null
  >(null);
  const [selectedDateRange, setSelectedDateRange] = useState<null | {
    startDate: string;
    endDate: string;
  }>(null);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchValue);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState();
  const [user, setUser] = useState<string | null>('null');

  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const {
    setIsLoadingTrue,
    setIsLoadingFalse,
    headerUrl,
    outletChange,
    setSalesId,
    setSalesFlag,
  } = useAuthStore();

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

  const getPaymentType = (item: any) => {
    var result = 'Cash';
    if (
      item.receivedCredit > 0 &&
      item.receivedCash > 0 &&
      item.receivedLoyality > 0
    ) {
      result = 'Cash, Card, Loyalty';
    } else if (item.receivedCredit > 0 && item.receivedCash > 0) {
      result = 'Cash, Card';
    } else if (item.receivedCredit > 0) {
      result = 'Card';
    }

    return result;
  };

  const fetchData = async () => {
    setData([]);

    try {
      setIsLoadingTrue();
      const queryParams: string[] = [];

      if (selectedPaymentType) {
        queryParams.push(`paymentTypes[]=${selectedPaymentType}`);
      }
      if (selectedPaymentStatus) {
        queryParams.push(`paymentStatuses[]=${selectedPaymentStatus}`);
      }
      if (selectedDateRange) {
        queryParams.push(`endDate=${selectedDateRange.endDate}`);
        queryParams.push(`startDate=${selectedDateRange.startDate}`);
      }
      if (debouncedSearchQuery.trim() !== '') {
        queryParams.push(`name=${debouncedSearchQuery}`);
      }

      const query = queryParams.join('&');

      const offlineSales = await getOfflineSales();

      console.log('offlineSales');
      console.log(offlineSales);

      const offlineData = offlineSales.map((item: any) => ({
        id: '--',
        'Order Id': '{Offline}',
        'Order Date': moment(item.payload.orderDate).format(
          'MMMM Do, YYYY, HH:mm:ss',
        ),
        'Sale Type': item.payload.salesType?.toUpperCase(),
        Customer: item.payload.customerName,
        'Payment Type': getPaymentType(item.payload),
        'Payment Status': item.payload.paymentStatus,
        'Sale Total': (
          item.payload.receivedCash +
          item.payload.receivedCredit +
          item.payload.receivedLoyality
        ).toFixed(2),
        Discount: item.payload.discount?.toFixed(2),
        Tax: (item.payload.tax ?? 0.0)?.toFixed(2),
        'Remaining Balance': (item.payload.remainingBalance ?? 0)?.toFixed(2),
        'Created By': user,
        'Modified By': user,
      }));

      console.log('offlineData');
      console.log(offlineData);

      const response = await getSaleHistory(skip, limit, query, headerUrl);
      setRawData(response.data.data.data);
      console.log('Response get Sales History:', response.data.data.data.count);
      setCount(response.data.data.data.count);
      setTotalSales(response.data.data.summary.sales);
      setTotalDiscount(response.data.data.summary.discount);

      const taxSum = response.data.data.data.reduce(
        (acc: number, item: any) => acc + (item.tax || 0),
        0,
      );
      setTotalTax(taxSum);
      setTotalTax(response.data.data.summary.tax);

      const formattedData = response.data.data.data.map((item: any) => ({
        id: item._id,
        'Order Id': item.orderId,
        'Order Date': item.orderDate ? formatOrderDate(item.orderDate) : '',
        'Sale Type': item.salesType?.toUpperCase(),
        Customer: item.customer?.fullName
          ? item.customer.fullName
          : item.customerName,
        'Payment Type': getPaymentType(item),
        'Payment Status': item.paymentStatus,
        'Sale Total': item.totalSale?.toFixed(2),
        Discount: item.discountAmount?.toFixed(2),
        Tax: item.tax?.toFixed(2),
        'Remaining Balance': item.remainingBalance?.toFixed(2),
        'Created By': item.createdBy?.fullName,
        'Modified By': item.updatedBy?.fullName,
      }));

      setData([...offlineData, ...formattedData]);
      setIsLoadingFalse();
    } catch (err) {
      console.error('Error fetching data:', err);
      setIsLoadingFalse();
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {};
    }, [
      selectedPaymentStatus,
      selectedPaymentType,
      outletChange,
      selectedDateRange,
      debouncedSearchQuery,
      skip,
      limit,
    ]),
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

  const handleOnRefund = (row: any) => {
    console.log('Row Refund: ', row);
    setSalesId(row?.id);
    setSalesFlag(true);
    navigation.navigate('POS-Process-Sales');
  };

  const handleOnEdit = (row: any) => {
    console.log('Row Edit: ', row);
    setSalesId(row?.id);
    setSalesFlag(false);
    navigation.navigate('POS-Process-Sales');
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchValue);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchValue]);

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(user => setUser(user))
      .catch(error => console.error('Failed to load user:', error));
  }, []);

  const [dateRange, setDateRange] = useState<string>('Select Date Range');

  async function printSale(row: any, index: number) {
    try {
      const sale = rawData[index];
      setIsLoadingTrue();
      const outletResponse = await getOutletByIdApi(sale.outletId, headerUrl);
      const response = await getSaleDetials(sale._id, headerUrl);
      setIsLoadingFalse();
      sendForPrint(
        sale.orderId,
        response?.data?.data?.logo ?? '',
        outletResponse?.data?.data,
        sale,
      );
    } catch (error) {
      setIsLoadingFalse();
    }
  }

  function sendForPrint(invoiceNo: any, logo: any, outlet: any, sale: any) {
    var printObjs = [];
    printObjs.push({
      text: logo,
      dir: 'center',
      size: '12',
      next_line: false,
      type: 'bitmap',
    });
    // printObjs.push({
    //   text: moment().format('M/D/YY h:mm A'),
    //   dir: 'left',
    //   size: '10',
    //   next_line: false,
    // });
    // printObjs.push({
    //   text: 'Poxfy E-POS',
    //   dir: 'center',
    //   size: '10',
    //   next_line: false,
    // });
    // printObjs.push({
    //   text: ' ',
    //   dir: 'right',
    //   size: '10',
    //   next_line: true,
    // });
    printObjs.push({
      text: outlet?.name ?? '-',
      dir: 'center',
      size: '21',
      style: 'bold',
      next_line: true,
    });
    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '10',
      style: 'bold',
      next_line: true,
    });
    printObjs.push({
      text: outlet?.phone,
      dir: 'center',
      size: '21',
      next_line: true,
    });
    printObjs.push({
      text: outlet?.email,
      dir: 'center',
      size: '21',
      next_line: true,
    });
    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '10',
      style: 'bold',
      next_line: true,
    });
    printObjs.push({
      text: 'Tax Invoice',
      dir: 'center',
      size: '21',
      style: 'bold',
      next_line: true,
    });
    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '10',
      style: 'bold',
      next_line: true,
    });
    printObjs.push({
      text:
        'Printed At: ' +
        moment(sale.createdAt).format('DD MMM YYYY hh:mm:ss a'),
      dir: 'center',
      size: '21',
      next_line: true,
      style: 'bold',
    });

    var linePieces = 114;
    var borderStr = '';
    for (var i = 0; i <= linePieces; i++) {
      borderStr += '_';
    }
    printObjs.push({
      text: borderStr,
      dir: 'center',
      size: '10',
      style: 'bold',
      next_line: true,
    });

    printObjs.push({
      text: 'Invoice #',
      dir: 'left',
      size: '21',
      next_line: false,
    });
    printObjs.push({
      text: invoiceNo,
      dir: 'right',
      size: '21',
      next_line: true,
    });

    printObjs.push({
      text: 'Created By',
      dir: 'left',
      size: '21',
      next_line: false,
    });
    printObjs.push({
      text: sale.createdBy?.fullName,
      dir: 'right',
      size: '21',
      next_line: true,
    });

    printObjs.push({
      text: 'Order Date',
      dir: 'left',
      size: '21',
      next_line: false,
    });
    printObjs.push({
      text: moment(sale.createdAt).format('DD MMM YYYY hh:mm:ss a'),
      dir: 'right',
      size: '21',
      next_line: true,
    });

    printObjs.push({
      text: 'Customer Name',
      dir: 'left',
      size: '21',
      next_line: false,
    });
    printObjs.push({
      text: sale.customerName,
      dir: 'right',
      size: '21',
      next_line: true,
    });
    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '10',
      next_line: true,
    });

    printObjs.push({
      text: 'Qty',
      dir: 'left',
      size: '21',
      next_line: false,
      style: 'bold',
    });
    printObjs.push({
      text: 'Item',
      dir: 'left',
      size: '21',
      next_line: false,
      style: 'bold',
      weight: 3.0,
    });
    printObjs.push({
      text: 'Price',
      dir: 'right',
      size: '21',
      next_line: false,
      style: 'bold',
    });
    printObjs.push({
      text: 'Total',
      dir: 'right',
      size: '21',
      next_line: true,
      style: 'bold',
    });
    sale.saleDetails.forEach((item: any) => {
      printObjs.push({
        text: borderStr,
        dir: 'center',
        size: '10',
        style: 'bold',
        next_line: true,
      });
      printObjs.push({
        text: '  ' + item.quantity,
        dir: 'left',
        size: '21',
        next_line: false,
      });
      printObjs.push({
        text: item.product?.name,
        dir: 'left',
        size: '21',
        next_line: false,
        weight: 3.0,
      });
      printObjs.push({
        text: item.price?.toFixed(2),
        dir: 'right',
        size: '21',
        next_line: false,
      });
      printObjs.push({
        text: (item.price * item.quantity)?.toFixed(2),
        dir: 'right',
        size: '21',
        next_line: true,
      });
    });

    printObjs.push({
      text: borderStr,
      dir: 'center',
      size: '10',
      style: 'bold',
      next_line: true,
    });

    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '10',
      next_line: true,
    });

    if ((sale.discountAmount || 0) > 0) {
      printObjs.push({
        text: ' ',
        dir: 'center',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: 'Discount',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: (sale.discountAmount?.toFixed(2) ?? 0.0) + '  ',
        dir: 'right',
        size: '21',
        next_line: true,
      });
    }

    if ((sale.tax || 0) > 0) {
      printObjs.push({
        text: ' ',
        dir: 'center',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: 'Tax',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: sale.tax?.toFixed(2) + '  ',
        dir: 'right',
        size: '21',
        next_line: true,
      });
    }

    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '21',
      style: 'bold',
      next_line: false,
    });
    printObjs.push({
      text: 'Subtotal',
      dir: 'right',
      size: '21',
      style: 'bold',
      next_line: false,
    });
    printObjs.push({
      text: sale.subTotal?.toFixed(2) + '  ',
      dir: 'right',
      size: '21',
      next_line: true,
    });

    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '21',
      style: 'bold',
      next_line: false,
    });
    printObjs.push({
      text: 'Total',
      dir: 'right',
      size: '21',
      style: 'bold',
      next_line: false,
    });
    printObjs.push({
      text: sale.totalSale?.toFixed(2) + '  ',
      dir: 'right',
      size: '21',
      style: 'bold',
      next_line: true,
    });

    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '10',
      style: 'bold',
      next_line: true,
    });

    if (sale.receivedCash > 0) {
      printObjs.push({
        text: ' ',
        dir: 'center',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: 'Cash',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: sale.receivedCash?.toFixed(2) + '  ',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: true,
      });
    }

    if (sale.receivedCredit > 0) {
      printObjs.push({
        text: ' ',
        dir: 'center',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: 'Credit',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: sale.receivedCredit?.toFixed(2) + '  ',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: true,
      });
    }

    if (sale.receivedLoyality > 0) {
      printObjs.push({
        text: ' ',
        dir: 'center',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: 'Loyalty',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: sale.receivedLoyality?.toFixed(2) + '  ',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: true,
      });
    }

    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '15',
      next_line: true,
    });
    printObjs.push({
      text: 'Products Count: ' + sale.saleDetails.length,
      dir: 'center',
      size: '21',
      next_line: true,
    });

    try {
      const str = JSON.stringify([printObjs]);
      NativePrintSdk?.printJson(str);
    } catch (error) {
      console.error('Error calling PrintSdk:', error);
    }
  }

  return (
    <View style={{flex: 1, marginHorizontal: 8, marginBottom: 8}}>
      <TableCard
        heading="Sales History"
        headerChildren={
          <TouchableOpacity
            style={{marginTop: 4}}
            onPress={() => {
              setSelectedDateRange(null);
              setDateRange('Select Date Range');
              setSelectedPaymentStatus(null);
              setSelectedPaymentType(null);
              setSearchValue('');
              fetchData();
            }}>
            <View
              style={{
                backgroundColor: '#e4e4e4',
                padding: 8,
                borderRadius: 24,
              }}>
              <Feather name="refresh-cw" size={17} color="red" />
            </View>
          </TouchableOpacity>
        }
        children={
          <View style={{flex: 1}}>
            <View style={[styles.searchContainer, styles.searchTextFocused]}>
              <MaterialCommunityIcons name="magnify" size={20} color="black" />
              <TextInput
                style={styles.searchText}
                value={searchValue}
                placeholder="Find product by name, barcode"
                onChangeText={setSearchValue}
                keyboardType="default"
              />
            </View>

            <View style={styles.dropdownView}>
              <Dropdown
                style={styles.dropdown}
                data={paymentType}
                labelField="label"
                valueField="value"
                placeholder="Select Payment Type"
                placeholderStyle={{color: 'gray', fontSize: 13}}
                value={selectedPaymentType}
                containerStyle={{borderRadius: 10}}
                selectedTextStyle={{fontSize: 13}}
                onChange={item => setSelectedPaymentType(item.value)}
                itemTextStyle={{fontSize: 13}}
                selectedTextProps={{numberOfLines: 1}}
                mode="auto"
              />
              <Dropdown
                style={styles.dropdown}
                data={paymentStatuses}
                labelField="label"
                valueField="value"
                placeholder="Select Payment Status"
                placeholderStyle={{color: 'gray', fontSize: 13}}
                value={selectedPaymentStatus}
                containerStyle={{borderRadius: 10}}
                selectedTextStyle={{fontSize: 13}}
                itemTextStyle={{fontSize: 13}}
                onChange={item => setSelectedPaymentStatus(item.value)}
                selectedTextProps={{numberOfLines: 1}}
                mode="auto"
              />
              <View style={{width: 280}}>
                <DualDatePicker
                  onDatesClear={() => setSelectedDateRange(null)}
                  onDatesSelect={(start, end) =>
                    setSelectedDateRange({startDate: start, endDate: end})
                  }
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                />
              </View>
            </View>

            <SalesSummary
              sales={totalSales}
              discount={totalDiscount}
              tax={totalTax}
            />

            <CustomDataTable
              flexes={[2, 4, 2, 3, 3, 2, 2, 2, 2, 3, 3, 3]}
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
              showRefund={true}
              onRefund={handleOnRefund}
              onEdit={handleOnEdit}
              count={count}
              skip={skip}
              setSkip={setSkip}
              limit={limit}
              setLimit={setLimit}
              showPrint={true}
              onPrint={printSale}
            />
          </View>
        }></TableCard>

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
  dropdownView: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  dropdown: {
    height: 40,
    backgroundColor: 'none',
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 14,
    borderColor: 'rgb(202,202,202)',
    borderWidth: 1,
    width: 160,
  },
});

export default SalesHistory;
