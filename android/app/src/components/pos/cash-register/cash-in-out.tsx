import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {safeNumber} from '../../../utils/helper';

interface PaymentSummaryProps {
  registerData?: any;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({registerData}) => {
  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.row}>
        <Text style={[styles.header, styles.left]}>Transaction</Text>
        <Text style={[styles.header, styles.left]}>User</Text>
        <Text style={[styles.header, styles.right]}>Amount</Text>
      </View>

      {/* Table Row */}
      <View style={styles.row}>
        <Text style={[styles.cell, styles.left]}>{'Opening Float'}</Text>
        <Text style={[styles.cell, styles.left]}>
          {registerData?.createdBy?.fullName}
        </Text>
        <Text style={[styles.cell, styles.right]}>
          {registerData?.transaction?.openingBalance}
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
