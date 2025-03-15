import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import BasicCard from '../../../components/basic-card';
import CashRegisterInvoice from './cash-register-invoice';
import SaleSummary from '../../../components/pos/cash-register/sale-summary';
import CashInOut from '../../../components/pos/cash-register/cash-in-out';
import PaymentSummary from '../../../components/pos/cash-register/payment-summary';
import TaxSummary from '../../../components/pos/cash-register/tax-summary';
import PaymentTally from '../../../components/pos/cash-register/payment-tally';
import CashInModal from '../../../components/modals/cash-in';
import CashOutModal from '../../../components/modals/cash-out';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getRegisterDetailsApi} from '../../../services/register';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import useAuthStore from '../../../redux/feature/store';
import CustomPopConfirm from '../../../components/pop-confirm';
import {API_BASE_URL} from '../../../constants';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

const CashRegister: React.FC<any> = () => {
  const handleCashInClick = () => {
    setCashInModalVisible(true);
  };

  const handleCashOutClick = () => {
    setCashOutModalVisible(true);
  };

  const [registerId, setRegisterId] = useState('');

  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const [registerData, setRegisterData] = useState<any>();
  const {
    setIsLoadingTrue,
    setIsLoadingFalse,
    headerUrl,
    outletChange,
    setRedirectToProcessSalesFalse,
  } = useAuthStore();

  const handleOpenRegister = useCallback(async () => {
    let response;
    try {
      setIsLoadingTrue();
      const outletId = await AsyncStorage.getItem('selectedOutlet');
      setRegisterId(outletId || '');
      if (outletId) {
        response = await getRegisterDetailsApi(outletId, headerUrl);
        console.log('Response Register Details:', response.data.data);
      }
      if (response?.data.meta.success) {
        setRegisterData(response.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingFalse();
    }
  }, [outletChange]);

  useFocusEffect(
    useCallback(() => {
      handleOpenRegister();
    }, [handleOpenRegister]),
  );

  const [cashInModalVisible, setCashInModalVisible] = useState(false);
  const [selectedCashInRow, setSelectedCashInRow] = useState<{
    [key: string]: string | number;
  } | null>(null);

  const [cashOutModalVisible, setCashOutModalVisible] = useState(false);
  const [popConfirmVisible, setPopConfirmVisible] = useState(false);

  const [countedCash, setCountedCash] = useState('0');
  const [countedCard, setCountedCard] = useState('0');
  const [countedCredit, setCountedCredit] = useState('0');

  const handleCloseRegister = async () => {
    try {
      setIsLoadingTrue();

      const token = await AsyncStorage.getItem('userToken');
      let url = `${API_BASE_URL}cash-register/${registerData.cashRegister._id}/close/${registerData._id}`;
      console.log('URL:', url);
      const payload = {
        countedCard: Number(countedCash),
        countedCash: Number(countedCard),
        countedCredit: Number(countedCredit),
        isActive: true,
      };
      console.log('Close register payload: ', payload);
      const response = await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          origin: headerUrl,
          referer: headerUrl,
        },
      });

      console.log('Response Close Register:', response.data);

      if (response.data.meta.success) {
        console.log('Navigating to Cash Registers');
        setRedirectToProcessSalesFalse();
        navigation.navigate('POS-Cash-Registers');
        setCountedCard('');
        setCountedCash('');
        setCountedCredit('');
      }

      setIsLoadingFalse();
    } catch (err) {
      console.error('Error fetching data:', err);
      setIsLoadingFalse();
    }
    navigation.navigate('POS-Cash-Registers');
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Cash Register</Text>
        <Text style={styles.date}>
          <Text style={styles.bold}>Opened:</Text>{' '}
          {registerData?.startTime
            ? `${new Date(
                registerData.startTime,
              ).toLocaleDateString()} - ${new Date(
                registerData.startTime,
              ).toLocaleTimeString()}`
            : '13/02/2025 - 08:56:06'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.row}>
          <View style={styles.column}>
            <BasicCard heading="Payment Tally">
              <PaymentTally
                registerData={registerData}
                countedCash={countedCash}
                setCountedCash={setCountedCash}
                countedCard={countedCard}
                setCountedCard={setCountedCard}
                countedCredit={countedCredit}
                setCountedCredit={setCountedCredit}
              />
            </BasicCard>

            <BasicCard heading="Sale Summary">
              <SaleSummary registerData={registerData} />
            </BasicCard>
          </View>

          <View style={styles.column}>
            <BasicCard
              buttons={[
                {
                  icon: 'cash',
                  iconColor: 'rgb(103, 223, 135)',
                  text: 'IN',
                  textColor: 'rgb(103, 223, 135)',
                  textSize: 10,
                  backgroundColor: 'rgb(245, 255, 250)',
                  borderColor: 'rrgb(103, 223, 135)',
                  onPress: () => {
                    handleCashInClick();
                  },
                },
                {
                  icon: 'cash',
                  iconColor: 'rgb(237, 105, 100)',
                  text: 'OUT',
                  textColor: 'rgb(237, 105, 100)',
                  textSize: 10,
                  backgroundColor: 'rgb(253, 243, 242)',
                  borderColor: 'rgb(237, 105, 100)',
                  onPress: () => {
                    handleCashOutClick();
                  },
                },
              ]}
              heading="Cash IN/OUT">
              <CashInOut registerData={registerData} />
            </BasicCard>

            <BasicCard heading="Payment Summary">
              <PaymentSummary registerData={registerData} />
            </BasicCard>

            <BasicCard heading="Tax Summary">
              <TaxSummary registerData={registerData} />
            </BasicCard>
            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress={() => setPopConfirmVisible(true)}
                style={styles.actionButton}>
                <Text style={styles.buttonText}>Close Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <CashInModal
        registerData={registerData}
        visible={cashInModalVisible}
        onClose={() => setCashInModalVisible(false)}
      />
      <CashOutModal
        registerData={registerData}
        visible={cashOutModalVisible}
        onClose={() => setCashOutModalVisible(false)}
      />
      <CustomPopConfirm
        title="Confirm Close Register"
        description="Are you sure you want to close register?"
        onConfirm={handleCloseRegister}
        onCancel={() => setPopConfirmVisible(false)}
        okText="Confirm"
        cancelText="Cancel"
        visible={popConfirmVisible}
        setVisible={setPopConfirmVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'none',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingLeft: 5,
    paddingRight: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    fontWeight: '300',
  },
  bold: {
    fontWeight: '500',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(237,105, 100)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    height: 50,
    width: 150,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default CashRegister;
