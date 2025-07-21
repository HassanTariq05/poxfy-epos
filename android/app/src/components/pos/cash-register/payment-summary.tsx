import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {safeNumber} from '../../../utils/helper';

interface PaymentSummaryProps {
  registerData?: any;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({registerData}) => {
  const calculate = (rec = 0, ref = 0) => {
    return (Number(rec) - Number(ref)).toFixed(2);
  };

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.row}>
        <Text style={[styles.header, styles.left]}>Payment Received</Text>
        <Text style={[styles.header, styles.center]}>Refunds</Text>
        <Text style={[styles.header, styles.right]}>Net Receipts</Text>
      </View>

      {/* Table Row */}
      <View style={styles.row}>
        <Text style={[styles.cell, styles.left]}>
          {safeNumber(registerData?.transaction?.received)}
        </Text>
        <Text style={[styles.cell, styles.center]}>
          {safeNumber(registerData?.transaction?.refund)}
        </Text>
        <Text style={[styles.cell, styles.right]}>
          {calculate(
            registerData?.transaction?.received || 0,
            registerData?.transaction?.refund || 0,
          )}
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
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
});

export default PaymentSummary;
