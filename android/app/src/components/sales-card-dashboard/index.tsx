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
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomColor: '#00e37d5f',
    borderBottomWidth: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 12,
    color: '#666',
    textAlign: 'left',
  },
});

export default SalesCard;
