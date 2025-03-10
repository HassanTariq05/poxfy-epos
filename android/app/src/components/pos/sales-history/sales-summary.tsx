import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface SalesSummaryProps {
  sales: number;
  discount: number;
  tax: number;
}

const SalesSummary: React.FC<SalesSummaryProps> = ({sales, discount, tax}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={[styles.label, {color: 'rgb(103, 223, 135)'}]}>
          Total Sales
        </Text>
        <View style={[styles.line, {backgroundColor: 'rgb(103, 223, 135)'}]} />
        <Text style={[styles.value, {color: 'rgb(103, 223, 135)'}]}>
          {sales.toFixed(2)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.label, {color: 'rgb(236, 105, 100)'}]}>
          Total Discount Given
        </Text>
        <View style={[styles.line, {backgroundColor: 'rgb(236, 105, 100)'}]} />
        <Text style={[styles.value, {color: 'rgb(236, 105, 100)'}]}>
          {discount.toFixed(2)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.label, {color: 'rgb(103, 223, 135)'}]}>
          Total Tax Collected
        </Text>
        <View style={[styles.line, {backgroundColor: 'rgb(103, 223, 135)'}]} />
        <Text style={[styles.value, {color: 'rgb(103, 223, 135)'}]}>
          {tax.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
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
  line: {
    width: '100%',
    height: 1,
    marginVertical: 5,
  },
  value: {
    fontSize: 22,
    fontWeight: '500',
  },
});

export default SalesSummary;
