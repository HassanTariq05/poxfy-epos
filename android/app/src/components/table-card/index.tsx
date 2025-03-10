import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-paper';

interface TableCardProps {
  heading?: string;
  button?: string;
  children?: React.ReactNode;
  style?: any;
  onAction?: any;
  headerChildren?: any;
}

const TableCard: React.FC<TableCardProps> = ({
  heading,
  children,
  style,
  button,
  onAction,
  headerChildren,
}) => {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.header}>
        {heading && <Text style={styles.heading}>{heading}</Text>}
        {button && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onAction()}>
            <Text style={styles.buttonText}>{button}</Text>
          </TouchableOpacity>
        )}
        {headerChildren}
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
    paddingVertical: 15,
    paddingHorizontal: 20,
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(237,105, 100)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: 120,
    textAlign: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
  },
});
