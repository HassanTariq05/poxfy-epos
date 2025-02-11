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

const SummaryCard: React.FC<SalesCardProps> = ({
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
          <View style={styles.column}>
            {items.slice(0, 2).map((item, index) => (
              <View key={index} style={styles.item}>
                <Text style={styles.period}>{item.period}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            ))}
          </View>
          {items.length > 2 && (
            <View style={styles.thirdItemContainer}>
              <View style={styles.item}>
                <Text style={styles.period}>{items[2].period}</Text>
                <Text style={styles.value}>{items[2].value}</Text>
              </View>
            </View>
          )}
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
    maxWidth: 370,
    width: '100%',
    height: 210,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  thirdItemContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  item: {
    marginBottom: 10,
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

export default SummaryCard;
