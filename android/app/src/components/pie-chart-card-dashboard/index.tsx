import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PieChart from 'react-native-pie-chart';

interface PieChartCardProps {
  title: string;
  series: [
    {
      value: 430;
      color: '#fbd203';
      label: {text: string; fill: string};
    },
  ];
}

const PieChartCard: React.FC<PieChartCardProps> = ({title, series}) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            marginTop: 8,
          }}>
          <PieChart widthAndHeight={140} series={series} />
        </View>
        {series.map((item, index) => (
          <View
            key={index}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                width: 6,
                height: 3,
                backgroundColor: item.color,
                marginRight: 4,
                marginTop: 1,
              }}
            />
            <Text style={{color: '#000', fontSize: 8}}>{item.label.text}</Text>
          </View>
        ))}
      </View>
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

export default PieChartCard;
