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
        <View style={{flexDirection: 'row', gap: 2}}>
          {items.map((item, index) => (
            <View key={index} style={{flex: 1}}>
              <Text style={{fontSize: 12}}>{item.period}</Text>
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
    flex: 1,
    borderRadius: 16,
    padding: 8,
    marginTop: 8,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  contentView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '30%',
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  period: {
    flex: 1,
    fontSize: 19,
    color: '#666',
  },
});

export default StatusCard;
