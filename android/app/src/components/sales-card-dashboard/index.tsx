import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface SalesCardProps {
  title: string;
  value: string | number;
  period: string;
}

const SalesCard: React.FC<SalesCardProps> = ({title, value, period}) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Text style={styles.period}>{period}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    width: '32.50%',
    height: 210,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    borderBottomColor: 'rgb(103,223,135)',
    borderBottomWidth: 1,
    color: 'rgb(103,223,135)',
  },
  value: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
  },
});

export default SalesCard;
