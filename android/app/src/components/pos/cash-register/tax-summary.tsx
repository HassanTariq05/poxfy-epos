import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {safeNumber} from '../../../utils/helper';

interface TaxSummaryProps {
  registerData?: any;
}

const TaxSummary: React.FC<TaxSummaryProps> = ({registerData}) => {
  const {transaction} = registerData || {};

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.header, styles.left, styles.wide]}>Tax</Text>
        <Text style={[styles.header, styles.left]}>Sales</Text>
        <Text style={[styles.header, styles.right]}>Tax</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.cell, styles.left, styles.wide]}>GST</Text>
        <Text style={[styles.cell, styles.left]}>
          {safeNumber(transaction?.total)}
        </Text>
        <Text style={[styles.cell, styles.right]}>
          {safeNumber(transaction?.gst)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.cell} />
        <Text style={[styles.cell, styles.left, styles.bold]}>Total</Text>
        <Text style={[styles.cell, styles.right, styles.green]}>
          {(transaction?.total || 0) * (1 + (transaction?.gst || 0) / 100)}
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
  wide: {
    flex: 2,
  },
  bold: {
    fontWeight: '600',
  },
  green: {
    color: 'rgb(103, 223, 135)',
    fontWeight: '600',
  },
});

export default TaxSummary;
