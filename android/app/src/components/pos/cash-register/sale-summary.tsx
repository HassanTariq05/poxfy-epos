import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

interface SaleSummaryProps {
  registerData: any;
}

const SaleSummary: React.FC<SaleSummaryProps> = ({registerData}) => {
  const formatNumber = (value: any) => {
    const number = Number(value);
    return isNaN(number) ? '0.00' : number.toFixed(2);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>Total Sales</Text>
          <Text style={styles.cellRight}>
            {formatNumber(registerData?.transaction?.total)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>On Account Sale</Text>
          <Text style={styles.cellRight}>
            {formatNumber(registerData?.transaction?.onAccountSale)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Item Discounts</Text>
          <Text style={styles.cellRight}>
            {formatNumber(registerData?.transaction?.itemDiscount)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Order Discounts</Text>
          <Text style={styles.cellRight}>
            {formatNumber(registerData?.transaction?.orderDiscount)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Surcharge</Text>
          <Text style={styles.cellRight}>
            {formatNumber(registerData?.transaction?.surcharge)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Avg Sale Volume</Text>
          <Text style={styles.cellRight}>
            {formatNumber(registerData?.transaction?.avgSalesVolume)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>No Of Transactions</Text>
          <Text style={styles.cellRight}>
            {formatNumber(registerData?.transaction?.totalTransactions)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  table: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(232, 231, 233)',
    justifyContent: 'space-between',
  },
  cell: {
    fontSize: 14,
    color: '#333',
  },
  cellRight: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
  },
});

export default SaleSummary;
