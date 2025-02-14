import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';

interface TableCardProps {
  heading?: string;
  children?: React.ReactNode;
  style?: any;
}

const TableCard: React.FC<TableCardProps> = ({heading, children, style}) => {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.header}>
        {heading && <Text style={styles.heading}>{heading}</Text>}
      </View>
      <View>{children}</View>
    </Card>
  );
};

export default TableCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 0,
    shadowColor: 'transparent',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});
