import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const InfoCardDashboard = ({
  mainheading,
  todayLabel,
  todayValue,
  yesterdayLabel,
  yesterdayValue,
  svgIcon,
  arrowSvg,
  svgIconBottom,
}: any) => {
  return (
    <View style={styles.cardContainer}>
      {/* Main Content */}
      <View style={styles.content}>
        {/* Data Section */}
        <View style={styles.dataContainer}>
          {/* Today */}
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>{todayLabel}</Text>
            <Text style={styles.dataValue}>{todayValue}</Text>
          </View>

          {/* Yesterday */}
          <View style={styles.dataItemSecond}>
            <Text style={styles.dataLabel}>{yesterdayLabel}</Text>
            <Text style={styles.dataValue}>{yesterdayValue}</Text>
          </View>
        </View>

        {/* Icon Section */}
        <View style={styles.iconContainer}>
          {svgIcon && <View style={styles.svgIcon}>{svgIcon}</View>}
        </View>
      </View>

      {/* Bottom Section with Wave & Arrow */}
      <View style={styles.bottomSection}>
        {svgIconBottom && <View style={styles.svgBottom}>{svgIconBottom}</View>}
        {arrowSvg && <View style={styles.arrowContainer}>{arrowSvg}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 10,
    width: '32.50%',
    height: 210,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  dataContainer: {
    flex: 1,
  },
  dataItem: {
    marginBottom: 10,
  },

  dataItemSecond: {
    marginTop: -10,
    marginBottom: 25,
  },
  dataLabel: {
    textTransform: 'uppercase',
    fontSize: 14,
    color: '#000',
  },
  dataValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  iconContainer: {
    width: 60,
    height: 60,
    marginTop: -70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgIcon: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: 'rgb(237, 105, 100)',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  bottomSection: {
    marginTop: 50,
    alignItems: 'center',
  },
  svgBottom: {
    width: '100%',
    height: 100,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 80,
    right: 35,
  },
});

export default InfoCardDashboard;
