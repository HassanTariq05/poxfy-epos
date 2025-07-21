import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
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
import {
  deleteCustmer,
  getLoyaltyBalance,
  getLoyaltyReport,
  updateCustomer,
} from '../../../services/customer';
import useAuthStore from '../../../redux/feature/store';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {Text} from 'react-native-gesture-handler';
import DualDatePicker from '../../../components/dual-date-picker';

interface LoyaltyModalProps {
  visible: any;
  onClose: () => void;
  customerDetails: string;
}

// function Loyalty() {
const LoyaltyModal: React.FC<LoyaltyModalProps> = ({
  visible,
  onClose,
  customerDetails,
}) => {
  const headers = [
    'Order ID',
    'Type',
    'Order Date',
    'Amount',
    'Accrued Points',
    'Points Used',
  ];

  const {customerId} = useAuthStore();

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
  const [loyalityBalance, setLoyalityBalance] = useState({
    totalPointsAccrued: 0,
    balance: 0,
    totalPointsUsed: 0,
  });

  const slideAnim = useRef(new Animated.Value(500)).current;

  const fetchLoyalty = async (id: any) => {
    try {
      setIsLoadingTrue();
      const response = await getLoyaltyBalance(id, headerUrl);
      console.log('getLoyaltyBalance:', response);
      setIsLoadingFalse();
      setLoyalityBalance(response.data.data);
    } catch (error) {
      setIsLoadingFalse();
      console.error('Error getLoyaltyBalance:', error);
    }
  };

  const [selectedDateRange, setSelectedDateRange] = useState<null | {
    startDate: string;
    endDate: string;
  }>(null);

  const fetchData = async () => {
    setData([]);
    setLoyalityBalance({
      totalPointsAccrued: 0,
      balance: 0,
      totalPointsUsed: 0,
    });
    try {
      setIsLoadingTrue();

      const queryParams: string[] = [];

      if (selectedDateRange) {
        queryParams.push(`endDate=${selectedDateRange.endDate}`);
        queryParams.push(`startDate=${selectedDateRange.startDate}`);
      }

      const query = queryParams.join('&');

      const response = await getLoyaltyReport(customerId, query, headerUrl);

      const formattedData = response.data.data.map((item: any) => ({
        'Order ID': item.orderId,
        Type: item.type,
        'Order Date': moment(item.orderDate).format('MMM DD, yyyy hh:mm:ss'),
        Amount: item.amount,
        'Accrued Points': item.accuredPoint,
        'Points Used': item.pointUsed,
      }));

      setData(formattedData);
      setIsLoadingFalse();

      fetchLoyalty(customerId);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [customerId, selectedDateRange]);

  const handleHeadingAction = () => {
    setModalVisible(true);
  };

  const [dateRange, setDateRange] = useState<string>('Select Date Range');
  return (
    <>
      {visible && (
        <Modal visible={visible} transparent animationType="none">
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.backdrop} onPress={onClose} />
            <View style={styles.modal}>
              <View style={{flex: 1, marginBottom: 8, marginHorizontal: 8}}>
                <TableCard
                  heading={'Loyalty'}
                  subheading={customerDetails}
                  onAction={handleHeadingAction}
                  headerChildren={
                    <>
                      <View style={{width: 280}}>
                        <DualDatePicker
                          onDatesClear={() => setSelectedDateRange(null)}
                          onDatesSelect={(start, end) => {
                            setSelectedDateRange({
                              startDate: start,
                              endDate: end,
                            });
                          }}
                          dateRange={dateRange}
                          setDateRange={setDateRange}
                        />
                      </View>
                      <TouchableOpacity
                        style={{marginLeft: 16}}
                        onPress={() => {
                          fetchData();
                        }}>
                        <Feather name="refresh-cw" size={17} color="red" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{marginLeft: 16}}
                        onPress={() => {
                          onClose();
                        }}>
                        <Feather name="x" size={17} color="black" />
                      </TouchableOpacity>
                    </>
                  }>
                  <View style={styles.container}>
                    <View style={styles.card}>
                      <Text
                        style={[styles.label, {color: 'rgb(103, 223, 135)'}]}>
                        Total Accured Points
                      </Text>
                      <View
                        style={[
                          styles.line,
                          {backgroundColor: 'rgb(103, 223, 135)'},
                        ]}
                      />
                      <Text
                        style={[styles.value, {color: 'rgb(103, 223, 135)'}]}>
                        {loyalityBalance.totalPointsAccrued.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.card}>
                      <Text
                        style={[styles.label, {color: 'rgb(236, 105, 100)'}]}>
                        Total Points Used
                      </Text>
                      <View
                        style={[
                          styles.line,
                          {backgroundColor: 'rgb(236, 105, 100)'},
                        ]}
                      />
                      <Text
                        style={[styles.value, {color: 'rgb(236, 105, 100)'}]}>
                        {loyalityBalance.totalPointsUsed.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.card}>
                      <Text
                        style={[styles.label, {color: 'rgb(103, 223, 135)'}]}>
                        Balance
                      </Text>
                      <View
                        style={[
                          styles.line,
                          {backgroundColor: 'rgb(103, 223, 135)'},
                        ]}
                      />
                      <Text
                        style={[styles.value, {color: 'rgb(103, 223, 135)'}]}>
                        {loyalityBalance.balance.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <CustomDataTable
                    flexes={[1, 1, 2, 1, 1, 1]}
                    alignments={[
                      'flex-start',
                      'flex-start',
                      'flex-start',
                      'flex-start',
                      'center',
                      'center',
                    ]}
                    headers={headers}
                    data={data}
                  />
                </TableCard>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    position: 'absolute',
    right: 0,
    height: 600,
    width: '90%',
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: -2, height: 2},
    shadowRadius: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
    alignSelf: 'stretch', // Ensure it stretches to fit content
    flexShrink: 1, // Prevents extra space from pushing content
  },
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
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
  },
  value: {
    fontSize: 22,
    fontWeight: '500',
  },
  line: {
    width: '100%',
    height: 1,
    marginVertical: 5,
  },
  backdrop: {
    flex: 1,
    width: '100%',
  },
});

export default LoyaltyModal;
