import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {safeNumber} from '../../../utils/helper';

// Define types for props
interface Transaction {
  received?: number;
  refund?: number;
}

interface RegisterData {
  transaction?: Transaction;
}

interface PaymentSummaryProps {
  registerData?: RegisterData;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({registerData}) => {
  const {transaction} = registerData || {};

  const calculate = (rec = 0, ref = 0) => {
    return (Number(rec) - Number(ref)).toFixed(2);
  };

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.row}>
        <Text style={[styles.header, styles.left]}>Payment Received</Text>
        <Text style={[styles.header, styles.left]}>Refunds</Text>
        <Text style={[styles.header, styles.right]}>Net Receipts</Text>
      </View>

      {/* Table Row */}
      <View style={styles.row}>
        <Text style={[styles.cell, styles.left]}>
          {safeNumber(transaction?.received)}
        </Text>
        <Text style={[styles.cell, styles.left]}>
          {safeNumber(transaction?.refund)}
        </Text>
        <Text style={[styles.cell, styles.right]}>
          {calculate(transaction?.received, transaction?.refund)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(232, 231, 233)',
    paddingVertical: 8,
  },
  header: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
  },
  left: {
    textAlign: 'left',
  },
  right: {
    textAlign: 'right',
  },
});

export default PaymentSummary;
