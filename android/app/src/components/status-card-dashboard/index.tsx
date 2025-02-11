import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface Item {
  period: string;
  value: string | number;
}

interface SalesCardProps {
  title: string;
  items: Item[];
  backgroundColor: string;
  color: string;
}

const StatusCard: React.FC<SalesCardProps> = ({
  title,
  items,
  backgroundColor,
  color,
}) => {
  return (
    <View style={[styles.card, {backgroundColor}]}>
      <View style={styles.content}>
        <Text style={[styles.title, {color}]}>{title}</Text>
        <View style={styles.contentView}>
          {items.map((item, index) => (
            <View key={index}>
              <Text style={styles.period}>{item.period}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    maxWidth: 500,
    width: '100%',
    height: 210,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  contentView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  value: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  period: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
  },
});

export default StatusCard;
