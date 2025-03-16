import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useForm} from 'react-hook-form';
import useAuthStore from '../../redux/feature/store';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  subTotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  subTotal,
  discount,
  tax,
  grandTotal,
}) => {
  const {handleSubmit} = useForm();
  const slideAnim = useRef(new Animated.Value(500)).current;
  const {setIsLoadingTrue, isLoading} = useAuthStore();
  const [amount, setAmount] = useState('');
  const [cashReceived, setCashReceived] = useState(0);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 500,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  useEffect(() => {
    setAmount(grandTotal.toString());
  }, [visible]);

  const onSubmit = async (data: any) => {
    setIsLoadingTrue();
    console.log('Submitted Data:', data);
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <Animated.View
          style={[styles.modal, {transform: [{translateX: slideAnim}]}]}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={30}
                  color="#ED6964"
                />
              </TouchableOpacity>
              <Text style={styles.title}>Bill Payment</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.leftContainer}>
                <Text style={styles.label}>Sale Summary</Text>
                <View style={[styles.paymentSummaryView, {marginTop: 0}]}>
                  <View style={[styles.paymentSummary, {paddingTop: 5}]}>
                    <Text style={styles.summaryLabel}>Sub Total</Text>
                    <Text style={styles.summaryValue}>
                      {subTotal.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.paymentSummary}>
                    <Text style={styles.summaryLabel}>Discount</Text>
                    <Text style={[styles.summaryValue, styles.discount]}>
                      {discount.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.paymentSummary}>
                    <Text style={styles.summaryLabel}>Tax</Text>
                    <Text style={styles.summaryValue}>{tax.toFixed(2)}</Text>
                  </View>

                  <View style={styles.paymentSummary}>
                    <Text style={styles.summaryLabel}>Grand Total</Text>
                    <Text style={styles.summaryValue}>
                      {grandTotal.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.paymentSummary}>
                    <Text style={styles.summaryLabel1}>After Discount</Text>
                    <Text style={styles.summaryValue1}>
                      {grandTotal.toFixed(2)}
                    </Text>
                  </View>

                  {cashReceived !== 0 && (
                    <View style={styles.paymentSummary}>
                      <Text style={styles.summaryLabel1}>Cash Received</Text>
                      <Text style={styles.summaryValue1}>
                        {cashReceived.toFixed(2)}
                      </Text>
                    </View>
                  )}

                  <View style={styles.paymentSummary}>
                    <Text style={styles.summaryLabel2}>To Pay</Text>
                    <Text style={styles.summaryValue2}>
                      {(grandTotal - cashReceived).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.rightContainer}>
                <View style={styles.container}>
                  <Text style={styles.label1}>Amount Tendered</Text>
                  <TextInput
                    style={styles.input}
                    value={amount}
                    keyboardType="numeric"
                    editable={true}
                    onChangeText={text => setAmount(text)}
                  />
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button1}>
                      <Text style={styles.buttonText}>Credit / Debit Card</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button1}
                      onPress={() => {
                        const receivedAmount = parseFloat(amount) || 0;
                        const newCashReceived = cashReceived + receivedAmount;
                        setCashReceived(newCashReceived);

                        const remainingBalance = grandTotal - newCashReceived;
                        setAmount(remainingBalance.toString());
                      }}>
                      <Text style={styles.buttonText}>Cash</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
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
  backButton: {
    marginRight: 10,
  },
  modal: {
    position: 'absolute',
    right: 0,
    width: '60%',
    maxHeight: '80%',
    backgroundColor: 'white',
    elevation: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  leftContainer: {
    flex: 0.4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'rgb(103, 223, 135)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(240,240,240)',
  },
  label1: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  button: {
    backgroundColor: '#ED6964',
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  button1: {
    backgroundColor: '#ED6964',
    height: 40,
    width: '48%',
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
  paymentSummaryView: {
    marginTop: 5,
  },
  paymentSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryLabel: {
    color: '#A3A3A3',
    fontSize: 14,
  },
  summaryLabel1: {
    color: 'black',
    fontWeight: '400',
    fontSize: 15,
  },
  summaryLabel2: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryValue: {
    color: '#A3A3A3',
    fontSize: 14,
  },
  summaryValue1: {
    color: 'black',
    fontSize: 15,
    fontWeight: '400',
  },
  summaryValue2: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  discount: {
    color: '#3B82F6',
  },
  rightContainer: {
    flex: 0.6,
    paddingLeft: 10,
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    flexGrow: 1,
    marginLeft: 10,
  },
  input: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PaymentModal;
